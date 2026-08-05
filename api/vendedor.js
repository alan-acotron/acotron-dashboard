// api/vendedor.js
// Función de servidor — SOLO entrega los datos del vendedor dueño del token.
// Ningún otro vendedor, ni datos de compras/inventario, salen de aquí.

const TOKENS = {
  '2795e325d36f1d35': 'jesus',
  '51fe68d7e990e1dd': 'juanjose',
  '20bc78606feb7eb9': 'marcela',
  '3d0516c925c80594': 'marisol',
  '4f4740136e65c381': 'guillermo',
  '1e47b57998920624': 'erick',
};

const VENDEDORES_PERSONAL = {
  jesus: {nombre:"Jesús Chávez",facturas:3711,clientes:640,total:1025724,
    topClientes:[["UMS COMPONENTES Y EQUIPOS INDUSTRIALES",90927,126],["DIONIREN GUADALUPE JIMENEZ LOPEZ",88587,155],["CONTROL TECNICO Y REPRESENTACIONES",48495,58],["LONAS UNITEX",32139,6],["GRUPO AB CONSTRUCTOR",27441,9]],
    mensual:[["2025-12",55398],["2026-01",52373],["2026-02",52079],["2026-03",65925],["2026-04",66168],["2026-05",61824]],
    topSku:[["MGB400-11","Tarj. Control CD Regen. 1/8-2HP",72059,477],["LGC400-10","Tarj. Ctl/CD 1/8-2HP 115/230VCA",67210,658],["445703","Higrotermómetro Digital",18692,496],["445702","Hygro-Termómetro Max/Min",16217,460],["E8 PRO","Cámara Termográfica MSX WiFi",11886,4]]},
  juanjose: {nombre:"Juan José López",facturas:573,clientes:321,total:91222,
    topClientes:[["VENTAS DE MOSTRADOR",8177,30],["CMI CONTROL Y MOVIMIENTO INDUSTRIAL",5121,11],["ANGEL DE LA TRINIDAD GUZMAN",3162,4],["ALFREDO GONZALEZ TORRES",3122,8],["WILLIAM JOSUE LEDEZMA RIVAS",3113,8]],
    mensual:[["2025-12",12094],["2026-01",5098],["2026-02",7973],["2026-03",29354],["2026-04",8334],["2026-05",2688]],
    topSku:[["L510-101-H1-U","Variador Frec. 115VCA 1HP",6693,42],["C5","Cámara Termográfica Bolsillo",2113,3],["385100240060","Interface con Relé 24AC/DC",1659,184],["GD200A-030G","Variador Frec. 40HP 440VAC",1503,1],["ODE3-20-15HP","Variador Frec. 240VCA 15HP",1202,1]]},
  marcela: {nombre:"Marcela Orozco",facturas:2300,clientes:784,total:554120,
    topClientes:[["MA IRMA RUIZ HERNANDEZ",58133,140],["APOC AUTOMATIZACION DE PROCESOS",42594,48],["RAUL MORALES HERNANDEZ",26555,65],["ASESORIA Y PROVEEDORA EQUIPOS LAB",20312,12],["TEKNOMETER MEXICO",17122,37]],
    mensual:[["2025-12",28469],["2026-01",25370],["2026-02",32576],["2026-03",43590],["2026-04",29987],["2026-05",24633]],
    topSku:[["RHT20","Datalogger Temp. y Humedad",25242,161],["MGB400-11","Tarj. Control CD Regen.",18569,121],["LGC400-10","Tarj. Ctl/CD 1/8-2HP",13954,131],["GD200A-220G","Variador Frec. 300HP",7939,1],["TCN4S-24R","Control Temperatura 1/16 DIN",6464,121]]},
  marisol: {nombre:"Ma. del Sol",facturas:4710,clientes:928,total:886002,
    topClientes:[["TERATRONIX",67018,376],["CMI CONTROL Y MOVIMIENTO INDUSTRIAL",62251,107],["HARVESTEK",54291,25],["EQUIPOS REFACCIONES CONTROLES OCC.",36041,65],["AUTOMATIZACION Y SOLUCIONES MUNDIALES",32322,146]],
    mensual:[["2025-12",31002],["2026-01",73124],["2026-02",65985],["2026-03",58933],["2026-04",80512],["2026-05",61885]],
    topSku:[["M22-R4K7","Potenciómetro 22mm 4.7K",23572,594],["PR12-4DP","Sensor PNP NA 4mm",23181,1327],["445703","Higrotermómetro Digital",22042,542],["7F2082304400","Ventilador c/Filtro 230VAC",11980,65],["C5","Cámara Termográfica Bolsillo",11332,17]]},
  guillermo: {nombre:"Guillermo Rodríguez",facturas:399,clientes:283,total:39625,
    topClientes:[["GABRIEL ANTONIO GUTIERREZ LUNA",4382,6],["ANGEL MENDOZA SAAVEDRA",1948,4],["GRUPO COMERCIAL ISUMA",1944,1],["VENTAS DE MOSTRADOR",1764,35],["INNOVACION INDUSTRIAL RAMES",1598,1]],
    mensual:[["2026-04",11883],["2026-05",27742]],
    topSku:[["SFL30-72","Cortinas de Seguridad 30mm",2778,2],["CONV.ROT.25HP","Convertidor de Fase Rotativo",1944,1],["ODE3-20-15HP","Variador Frec. 240VCA 15HP",1598,1],["GD350-015G","Variador Frec. 20HP 220VAC",1272,1],["S1","Contacto NA p/Botonería",882,312]]},
  erick: {nombre:"Erick Ramos",facturas:3606,clientes:1395,total:416726,
    topClientes:[["ALBERTO AGUILAR HERRERA",39906,19],["VENTAS DE MOSTRADOR",26944,266],["FLOMA TECHNOLOGIES",16297,67],["CRISTIAN JAEL MEJIA AGUIRRE",12927,85],["LAURA ELIANETT PRESA VAZQUEZ",12576,40]],
    mensual:[["2025-12",22179],["2026-01",23668],["2026-02",27363],["2026-03",31590],["2026-04",25482],["2026-05",21283]],
    topSku:[["GD200A-045G","Variador Frec. 60HP 3AC 440V",19588,10],["GD200A-030G","Variador Frec. 40HP 440VAC",18220,13],["ODE3S-10-1HP","Variador Frec. 115VCA 1HP",9443,49],["385100240060","Interface con Relé 24AC/DC",5509,608],["LGC400-10","Tarj. Ctl/CD 1/8-2HP",4867,36]]},
};

export default function handler(req, res) {
  const token = req.query.t || req.query.token;
  const key = TOKENS[token];

  if (!key) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  // Solo se regresa el objeto de ESTE vendedor. Nada más existe en la respuesta.
  res.status(200).json(VENDEDORES_PERSONAL[key]);
}
