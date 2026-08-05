# -*- coding: utf-8 -*-
"""
ACOTRON — Sistema de Alertas Telegram v2.0
=============================================================
RUTEO POR PERSONA:
  · Vendedores    → 3 clientes/día a reactivar (rotación diaria)
  · Luz           → compras INTERNACIONALES (ALTECH, FLIR, EXTECH...)
  · Brenda        → compras NACIONALES (DIGITEL, AUTONICS MX, FINDER...)
  · Ing. Contreras (Director)  → resumen ejecutivo SEMANAL
  · Ing. Preciado (Mkt)        → resumen ejecutivo SEMANAL

USO:
  python alertas_acotron.py vendedores   → 3 clientes/día a c/vendedor
  python alertas_acotron.py compras      → alertas de stock a Luz y Brenda
  python alertas_acotron.py semanal      → resumen al Director y Mkt
  python alertas_acotron.py test         → mensaje de prueba a todos los registrados

PROGRAMACIÓN AUTOMÁTICA (Windows Task Scheduler):
  · vendedores → Lun-Vie 8:30 AM
  · compras    → Lun y Jue 8:00 AM
  · semanal    → Viernes 5:00 PM

IMPORTANTE — CÓMO REGISTRAR A CADA PERSONA:
  Los bots de Telegram NO pueden enviar a números de teléfono.
  Cada persona debe (una sola vez):
    1. Abrir Telegram → buscar el bot de ACOTRON
    2. Presionar START y enviar "hola"
  Luego tú abres: https://api.telegram.org/bot<TOKEN>/getUpdates
  y copias el chat_id de cada quien a la sección EQUIPO de abajo.
"""

import requests
import sys
from datetime import date

# ═════════════════════════════════════════════════════════════
# CONFIG
# ═════════════════════════════════════════════════════════════
TOKEN = "8907678505:AAHmfTtSULdfieGX2McHhRYUaoHDJb1Mko8"

# chat_id = None → persona aún no registrada con el bot (se omite el envío)
EQUIPO = {
    # ── Dirección (resumen semanal) ──
    "ing_contreras": {"nombre": "Ing. Contreras", "rol": "director",  "tel": "+52 33 3101 1419", "chat_id": None},
    "ing_preciado":  {"nombre": "Ing. Preciado",  "rol": "marketing", "tel": "+52 33 1280 8284", "chat_id": "8877390244"},  # "Acotron Mark" — CONFIRMAR
    # ── Compras ──
    "luz":    {"nombre": "Luz",           "rol": "compras_intl", "tel": "+52 33 1986 9860", "chat_id": None},
    "brenda": {"nombre": "Brenda Robles", "rol": "compras_nac",  "tel": "+52 33 3167 1784", "chat_id": None},
    # ── Vendedores (alerta diaria de clientes) ──
    "juan_jose":  {"nombre": "Ing. Juan José López",     "rol": "vendedor", "tel": "3331894252", "chat_id": "8808979264",
                   "match": "ING JUAN JOSE LOPEZ"},
    "guillermo":  {"nombre": "Ing. Guillermo Rodríguez", "rol": "vendedor", "tel": "3319907277", "chat_id": "8910963801",
                   "match": "GUILLERMO"},
    "erick":      {"nombre": "Ing. Erick Ramos",         "rol": "vendedor", "tel": "3319925496", "chat_id": "8295616198",
                   "match": "ERICK GARCIA"},
    "jesus":      {"nombre": "Ing. Jesús Chávez",        "rol": "vendedor", "tel": "3319869867", "chat_id": "7983015089",
                   "match": "JESUS CHAVEZ"},
    "marcela":    {"nombre": "Marcela Orozco",           "rol": "vendedor", "tel": "3319869863", "chat_id": "8888935137",
                   "match": "MARCELA OROZCO"},
    "marisol":    {"nombre": "Ma. del Sol",              "rol": "vendedor", "tel": "3333591360", "chat_id": "8843369415",
                   "match": "MA. SOL DANIEL MUNDO"},
    # ── Alan (admin, recibe copia de todo) ──
    "alan": {"nombre": "Alan", "rol": "admin", "tel": "+52 33 1924 1842", "chat_id": "977119840"},
}

# ── Clasificación de proveedores (EDITA según tu operación) ──
PROVEEDORES_INTL = ["ALTECH PROCESS", "FLIR COMMERCIAL SYSTEMS", "EXTECH", "TEKNO POWERS"]
PROVEEDORES_NAC  = ["CIA. ELECTRONICA DIGITEL", "AUTONICS MEXICO", "RELEVADORES FINDER", "KLOEMECOM",
                    "MANTENIMIENTO QUIMICO IND"]

# ═════════════════════════════════════════════════════════════
# DATA — CLIENTES INACTIVOS POR VENDEDOR (corte 17-Jul-2026)
# Cada corrida diaria rota 3 clientes distintos por vendedor.
# Actualiza esta lista con cada corte de datos mensual.
# ═════════════════════════════════════════════════════════════
CLIENTES_INACTIVOS = {
    "MA. SOL DANIEL MUNDO": [
        {"nom":"INNOVACIONES TEC. APLICADAS","usd":5846,"ticket":5846,"ult":"2025-06-30","meses":12.7,
         "skus":["Variador GD200A 25HP 440V","Variador ODE3 7.5HP 480V","Contador de partículas VPC300"],
         "gancho":"Compró variadores de alta potencia — probable proyecto industrial. Ofrecer stock nuevo INVT GD200A y revisión de refacciones."},
        {"nom":"JORGE ABEL CARDENAS ESTRADA","usd":5808,"ticket":1162,"ult":"2025-12-04","meses":7.5,
         "skus":["Tarjeta aislamiento ISO202","Tarjeta control velocidad LGP101","Tarjeta LGC400"],
         "gancho":"Cliente recurrente de tarjetas de control (5 facturas). Las tarjetas se dañan con el uso — preguntar por mantenimiento y ofrecerle paquete."},
    ],
    "JESUS CHAVEZ": [
        {"nom":"FAVELAB (Los Mochis)","usd":4772,"ticket":434,"ult":"2025-09-26","meses":9.8,
         "skus":["Medidor calidad aire CO250","Higrotermómetro 445702","Registrador HUM/TEMP 42280A"],
         "gancho":"Laboratorio — compra medición ambiental con frecuencia (11 facturas 2025). Los sensores requieren recalibración anual: ofrecer renovación + RHT20 en stock."},
    ],
    "MARCELA OROZCO": [
        {"nom":"JOSUE SEVILLA PRUDENCIO","usd":4561,"ticket":1520,"ult":"2025-12-19","meses":7.0,
         "skus":["Probador aislamiento 380396","Medidor de tierra GRT300","Amperímetro EX840A"],
         "gancho":"Perfil electricista/contratista de media tensión. Ticket alto ($1,520). Temporada de auditorías eléctricas — ofrecer GRT300 disponible."},
        {"nom":"DANNY CHAVEZ VILLEGAS","usd":3027,"ticket":432,"ult":"2025-03-20","meses":16.1,
         "skus":["Variador ODE3F 5HP 480V","Variador ODE3S 5HP 240V","Transformador VRT0500"],
         "gancho":"16 meses sin comprar — riesgo de pérdida total. Compraba variadores 5HP: preguntar si el proyecto sigue y ofrecer precio especial de reactivación."},
    ],
    "JOSE LUIS GAITAN": [
        {"nom":"ELECTROMECANICA DEL GOLFO (Tampico)","usd":4477,"ticket":4477,"ult":"2025-12-16","meses":7.1,
         "skus":["Detector de fugas LD6000SET","Sensor H2 3110008020","Termopar tipo J"],
         "gancho":"Una sola compra pero de $4,477 — cliente industrial de mantenimiento predictivo. Ofrecer consumibles del LD6000 y sensores de repuesto."},
    ],
    "ERICK GARCIA": [
        {"nom":"AGROINDUSTRIA OLEICA DE LOS RIOS","usd":2215,"ticket":2215,"ult":"2025-05-12","meses":14.4,
         "skus":["Medidor vibraciones SDL800","Cámara termográfica C3-X","Manómetro HD350"],
         "gancho":"Agroindustria con mantenimiento predictivo. Compró cámara térmica — ofrecer curso/soporte FLIR y consumibles de inspección."},
        {"nom":"HUMBERTO URIEL CASTILLO CEJA","usd":1870,"ticket":1870,"ult":"2025-12-27","meses":6.7,
         "skus":["Cortinas de seguridad SFL20","Control velocidad MM JUNIOR","Torreta 50mm 24VCD"],
         "gancho":"Integrador de seguridad industrial. Las cortinas van en proyectos — preguntar por el siguiente proyecto y ofrecer Autonics en stock."},
    ],
}

# ═════════════════════════════════════════════════════════════
# DATA — COMPRAS URGENTES POR PROVEEDOR (corte 16-Jul-2026)
# ═════════════════════════════════════════════════════════════
COMPRAS_URGENTES = {
    "ALTECH PROCESS": [
        ("CTS4U-N","Clema terminal 35-40A","⚫ SIN STOCK",818,1636),
        ("CA802","Tope riel DIN 35mm","🔴 11 días",358,588),
        ("CDL4UN","Clema doble nivel 35A","⚫ SIN STOCK",166,332),
        ("5507563","Conector glándula M20","⚫ SIN STOCK",58,116),
        ("CA722/10","Puente 10 polos","🔴 3 días",53,100),
    ],
    "FLIR COMMERCIAL SYSTEMS": [
        ("445703","Higrotermómetro digital","⚫ SIN STOCK",75,150),
        ("RH390","Datalogger temp/humedad","⚫ SIN STOCK",12,24),
        ("EN130","Detector de red eléctrica","⚫ SIN STOCK",8,16),
    ],
    "CIA. ELECTRONICA DIGITEL": [
        ("2511120/1M","Riel DIN acero 35mm 1mt","🔴 10 días",128,214),
        ("REJILLA 120PF","Rejilla plástica filtro","🔴 1 día!",70,137),
        ("NP2-BS542","Botón hongo paro emergencia","🔴 0 días!",64,128),
        ("INS-25","Aislador resina AWG 25mm","⚫ SIN STOCK",48,97),
    ],
    "AUTONICS MEXICO": [
        ("SA-CB","Contacto Autonics NC","🔴 14 días",129,196),
        ("PR12-4DP","Sensor PNP NA 4mm","🔴 2 días!",101,195),
        ("SA-LA","Block LED blanco 110-220V","🔴 8 días",75,129),
        ("S2SR-S3W","Selector 2 posiciones","🔴 1 día!",29,57),
    ],
    "RELEVADORES FINDER": [
        ("345170240010","Relé 24VCD 6A","🔴 8 días",102,177),
        ("405290240000","Relé 24VCD 2P2T 8A","🔴 11 días",88,144),
        ("405281100000","Relé 2CC 110VAC 8A","⚫ SIN STOCK",21,42),
    ],
    "KLOEMECOM": [
        ("M22-R4K7","Potenciómetro 22mm 4.7K","⚫ SIN STOCK",30,60),
        ("M22-D-G","Pulsador verde 22mm","🔴 10 días",30,51),
    ],
}

# ═════════════════════════════════════════════════════════════
# RESUMEN SEMANAL EJECUTIVO
# ═════════════════════════════════════════════════════════════
def resumen_semanal():
    return f"""📊 *RESUMEN SEMANAL ACOTRON*
_Semana al {date.today().strftime('%d-%b-%Y')}_

*💰 VENTAS 2026 (Ene–May, SAI):*
· Total: *$1.19M USD* (▼18.1% vs 2025)
· Ticket promedio: *$160.39* (▲21.9%)
· E-Commerce SAI-WEB: $79K (6.6%)
· Ventas directas: $1.11M (93.3%)

*🏆 TOP VENDEDORES:*
1. Ma. Sol Daniel Mundo — $340K
2. Jesús Chávez — $276K
3. José de Jesús Vega — $155K

*📦 INVENTARIO (corte 16-Jul):*
· ⚫ *465 SKUs sin stock* con demanda activa
· 🔴 53 SKUs con <15 días de cobertura
· 🟡 212 SKUs en observación
· 💀 5,591 SKUs sin movimiento (capital muerto ~$870K MXN)

*🎯 ACCIONES EN CURSO:*
· Compras urgentes enviadas a Luz (intl) y Brenda (nac)
· Vendedores contactando 3 clientes inactivos/día
· Pendiente: integrar ODOO 2026 para métricas e-commerce

_Dashboard: http://localhost:5173 · Bot ACOTRON Alertas_"""

# ═════════════════════════════════════════════════════════════
# MOTOR DE ENVÍO
# ═════════════════════════════════════════════════════════════
def enviar(chat_id, mensaje):
    r = requests.post(f"https://api.telegram.org/bot{TOKEN}/sendMessage",
                      json={"chat_id": chat_id, "text": mensaje, "parse_mode": "Markdown"})
    return r.status_code == 200

def enviar_a(persona_key, mensaje):
    p = EQUIPO[persona_key]
    if not p["chat_id"]:
        print(f"  ⏭️  {p['nombre']} aún no registrado con el bot (falta chat_id)")
        return False
    ok = enviar(p["chat_id"], mensaje)
    print(f"  {'✅' if ok else '❌'} {p['nombre']}")
    return ok

# ── Rotación diaria: 3 clientes por vendedor ──────────────────
def alerta_vendedores():
    dia = date.today().toordinal()   # rota según el día
    for key, p in EQUIPO.items():
        if p["rol"] != "vendedor":
            continue
        clientes = CLIENTES_INACTIVOS.get(p.get("match",""), [])
        if not clientes:
            continue
        # Rotar: toma 3 empezando en offset del día
        n = len(clientes)
        idx = [(dia + i) % n for i in range(min(3, n))]
        seleccion = [clientes[i] for i in idx]

        msg = f"☀️ *Buenos días {p['nombre'].split()[0]}* — Tus 3 llamadas de hoy:\n"
        for i, c in enumerate(seleccion, 1):
            msg += f"""
*{i}. {c['nom']}*
   💰 Compró ${c['usd']:,} USD en 2025 · Ticket ${c['ticket']:,}
   📅 Última compra: {c['ult']} ({c['meses']} meses sin comprar)
   🛒 Le vendiste: {', '.join(c['skus'][:2])}
   🎯 *Por qué llamarle:* {c['gancho']}
"""
        msg += "\n📞 _Registra el resultado de cada llamada. ¡Éxito!_"
        enviar_a(key, msg)
        # Copia a Alan
        if EQUIPO["alan"]["chat_id"]:
            enviar(EQUIPO["alan"]["chat_id"], f"📋 Copia — enviado a {p['nombre']}:\n{msg[:500]}...")

# ── Alertas de compras (ruteo intl/nac) ───────────────────────
def alerta_compras():
    intl = {k:v for k,v in COMPRAS_URGENTES.items() if k in PROVEEDORES_INTL}
    nac  = {k:v for k,v in COMPRAS_URGENTES.items() if k in PROVEEDORES_NAC}

    def formatear(titulo, data):
        msg = f"🚨 *{titulo}*\n_Corte inventario: 16-Jul-2026_\n"
        total = 0
        for prov, items in data.items():
            msg += f"\n📦 *{prov}:*\n"
            for sku, desc, estado, vel, sug in items:
                msg += f"  {estado} `{sku}` — {desc}\n     Vel: {vel}/mes → *Pedir {sug} pzas*\n"
                total += sug
        msg += f"\n✅ *Total a ordenar: {total:,} piezas*\n_Dashboard: pestaña Compras_"
        return msg

    if intl:
        print("→ Compras INTERNACIONALES → Luz:")
        enviar_a("luz", formatear("COMPRAS INTERNACIONALES URGENTES", intl))
    if nac:
        print("→ Compras NACIONALES → Brenda:")
        enviar_a("brenda", formatear("COMPRAS NACIONALES URGENTES", nac))
    # Copia al admin
    enviar_a("alan", formatear("COPIA ADMIN — Todas las compras urgentes", COMPRAS_URGENTES))

# ── Resumen semanal a dirección ───────────────────────────────
def alerta_semanal():
    msg = resumen_semanal()
    print("→ Resumen semanal → Dirección:")
    enviar_a("ing_contreras", msg)
    enviar_a("ing_preciado", msg)
    enviar_a("alan", msg)

# ── Mensaje de bienvenida al equipo ───────────────────────────
def bienvenida():
    for key, p in EQUIPO.items():
        if p["rol"] != "vendedor" or not p["chat_id"]:
            continue
        nombre_corto = p["nombre"].replace("Ing. ", "").split()[0]
        msg = f"""👋 *¡Bienvenido {nombre_corto} al Bot de Alertas ACOTRON!*

A partir de ahora recibirás por este canal:

📞 *Cada mañana (Lun-Vie):* tus 3 clientes del día a contactar, con el historial de lo que han comprado y una sugerencia concreta de qué ofrecerles.

💡 *Además, podrás hacerme preguntas sobre TUS ventas y TUS clientes, por ejemplo:*

  · _"¿Quién es mi mejor cliente?"_
  · _"¿Qué mes vendí más?"_
  · _"¿A cuál de mis clientes debería llamarle para venderle una cámara termográfica?"_
  · _"Dame mis clientes con ticket promedio entre $200 y $2,000 USD"_

🔒 *Nota:* cada quien ve únicamente su propia información de ventas y clientes.

🚀 _Este sistema es para ayudarte a vender más, no para vigilarte. Úsalo a tu favor._

— Equipo ACOTRON"""
        enviar_a(key, msg)

# ── Test a todos los registrados ──────────────────────────────
def test():
    for key, p in EQUIPO.items():
        if p["chat_id"]:
            enviar_a(key, f"✅ Prueba de conexión — Bot ACOTRON Alertas\nHola {p['nombre']}, quedaste registrado para recibir alertas de *{p['rol']}*.")

# ═════════════════════════════════════════════════════════════
if __name__ == "__main__":
    modo = sys.argv[1] if len(sys.argv) > 1 else "test"
    print(f"🔔 ACOTRON Alertas — modo: {modo}\n")
    {"vendedores": alerta_vendedores,
     "compras":    alerta_compras,
     "semanal":    alerta_semanal,
     "bienvenida": bienvenida,
     "test":       test}.get(modo, test)()
    print("\n✔ Terminado.")
