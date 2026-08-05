// api/compras.js
// Función de servidor — SOLO entrega alertas de inventario/compras.
// Jamás incluye cifras de ventas, clientes o vendedores.

const TOKENS = {
  '73258171e28b2ffd': 'intl',   // Luz
  'cfdadaba516adc19': 'nac',    // Brenda
};

const PROVEEDORES = {
  intl: ["ALTECH PROCESS","FLIR COMMERCIAL SYSTEMS","EXTECH","TEKNO POWERS"],
  nac:  ["CIA. ELECTRONICA DIGITEL","AUTONICS MEXICO","RELEVADORES FINDER","KLOEMECOM","MANTENIMIENTO QUIMICO IND"],
};

const INV_NEGRO = [
  {sku:"CTS4U-N",desc:"CLEMA TERMINAL 35-40A",vel:818.2,sug:1636,prov:"ALTECH PROCESS",ult:"2025-12-17"},
  {sku:"CDL4UN",desc:"CLEMA DOBLE NIVEL 35A",vel:165.8,sug:332,prov:"ALTECH PROCESS",ult:"2025-12-16"},
  {sku:"445703",desc:"HIGROTERMOMETRO DIGITAL",vel:74.8,sug:150,prov:"FLIR COMMERCIAL SYSTEMS",ult:"2025-12-01"},
  {sku:"5507563",desc:"CONECTOR GLANDULA M20",vel:58.0,sug:116,prov:"ALTECH PROCESS",ult:"2025-09-03"},
  {sku:"INS-25",desc:"AISLADOR RESINA AWG 25MM",vel:48.4,sug:97,prov:"CIA. ELECTRONICA DIGITEL",ult:"2025-08-01"},
  {sku:"M22-R4K7",desc:"POTENCIOMETRO 22MM 4.7K",vel:29.8,sug:60,prov:"KLOEMECOM",ult:"2025-12-06"},
  {sku:"405281100000",desc:"RELE 2CC 110VAC 8A",vel:20.8,sug:42,prov:"RELEVADORES FINDER",ult:"2024-03-19"},
];

const INV_ROJO = [
  {sku:"CA802",desc:"TOPE RIEL DIN 35MM",stock:128,vel:358,dias:11,sug:588,prov:"ALTECH PROCESS"},
  {sku:"SA-CB",desc:"CONTACTO AUTONICS NC",stock:62,vel:128.8,dias:14,sug:196,prov:"AUTONICS MEXICO"},
  {sku:"2511120/1M",desc:"RIEL DIN ACERO 35MM 1MT",stock:42,vel:128,dias:10,sug:214,prov:"CIA. ELECTRONICA DIGITEL"},
  {sku:"345170240010",desc:"RELE 24VCD 6AMP",stock:28,vel:102.4,dias:8,sug:177,prov:"RELEVADORES FINDER"},
  {sku:"PR12-4DP",desc:"SENSOR PNP NA 4MM",stock:7,vel:101,dias:2,sug:195,prov:"AUTONICS MEXICO"},
];

export default function handler(req, res) {
  const token = req.query.t || req.query.token;
  const tipo = TOKENS[token];

  if (!tipo) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const proveedoresAmbito = PROVEEDORES[tipo];
  res.status(200).json({
    tipo,
    proveedores: proveedoresAmbito,
    negro: INV_NEGRO.filter(r => proveedoresAmbito.includes(r.prov)),
    rojo:  INV_ROJO.filter(r => proveedoresAmbito.includes(r.prov)),
  });
}
