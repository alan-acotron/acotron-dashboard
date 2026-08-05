// api/ecommerce.js
// Función de servidor — SOLO entrega datos de e-commerce (Jonathan).

const TOKENS = {
  '783453db1cd1a3f8': 'jonathan',
};

const ECOMMERCE = {
  total2025: 571762,
  clientes: 6739,
  canales: [
    {canal:"Mercado Libre",total:479892,pct:83.9,facturas:6741},
    {canal:"Amazon",total:77147,pct:13.5,facturas:1173},
    {canal:"Sitio web",total:7743,pct:1.4,facturas:44},
    {canal:"Cursos",total:6521,pct:1.1,facturas:18},
  ],
  mensual: [
    {mes:"Ene",ml:41261,amz:4277,web:482},{mes:"Feb",ml:41886,amz:2438,web:258},
    {mes:"Mar",ml:45381,amz:6321,web:324},{mes:"Abr",ml:39615,amz:6891,web:1360},
    {mes:"May",ml:48720,amz:8465,web:73},{mes:"Jun",ml:49940,amz:7332,web:219},
    {mes:"Jul",ml:28703,amz:5803,web:70},{mes:"Ago",ml:17310,amz:5173,web:0},
    {mes:"Sep",ml:39452,amz:3689,web:222},{mes:"Oct",ml:44876,amz:9502,web:4520},
    {mes:"Nov",ml:44240,amz:7793,web:142},{mes:"Dic",ml:38507,amz:9465,web:74},
  ],
  topSkuPorCanal: {
    "Mercado Libre":[["LGC400-10",14923],["CVR-2500",9742],["C5",8765],["C3-X",8692],["LT300",6394]],
    "Amazon":[["PTS7MX",15685],["W60PMX",2158],["RPM33",1875],["445703",1849],["E6XT",1747]],
    "Sitio web":[["E8 PRO",3151],["AN100",1205],["LP-A070-T9D6-C5T",1112]],
  }
};

export default function handler(req, res) {
  const token = req.query.t || req.query.token;
  if (!TOKENS[token]) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  res.status(200).json(ECOMMERCE);
}
