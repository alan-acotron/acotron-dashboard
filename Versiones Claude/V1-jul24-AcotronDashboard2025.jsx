import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
         XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

// ═══════════════════════════════════════════════════════════════
// ACOTRON · Dashboard Maestro v5.0 · 17-Jul-2026
// SAI 2025+2026 · ODOO 2025 · Inventario 16-Jul-2026
// Compras urgentes: velocidad real (Ene–May 2026)
// ═══════════════════════════════════════════════════════════════

// ── VENTAS DATA ──────────────────────────────────────────────
const VENTAS = {
"2025":{"anio":2025,"meses":12,"kpis":{"total":3556149,"ecommerce":776048,"directas":2770210,"facturas":27022,"ticket":131.6,"unidades":255662,"skus":4339,"pct_ec":21.8,"pct_dir":77.9},"monthly":[{"mes":1,"l":"Ene","t":312617,"ec":62960,"dir":249612,"f":2338},{"mes":2,"l":"Feb","t":278598,"ec":60978,"dir":217775,"f":2036},{"mes":3,"l":"Mar","t":288581,"ec":68518,"dir":221870,"f":2493},{"mes":4,"l":"Abr","t":268087,"ec":60705,"dir":206423,"f":2378},{"mes":5,"l":"May","t":306070,"ec":69019,"dir":235134,"f":2020},{"mes":6,"l":"Jun","t":301892,"ec":75657,"dir":222095,"f":2438},{"mes":7,"l":"Jul","t":300421,"ec":50903,"dir":249269,"f":2383},{"mes":8,"l":"Ago","t":271572,"ec":34873,"dir":236534,"f":1934},{"mes":9,"l":"Sep","t":312783,"ec":60615,"dir":251756,"f":2383},{"mes":10,"l":"Oct","t":323045,"ec":77636,"dir":245277,"f":2514},{"mes":11,"l":"Nov","t":315527,"ec":86430,"dir":228877,"f":2218},{"mes":12,"l":"Dic","t":279313,"ec":67776,"dir":211537,"f":1905}],"vend":[{"v":"JESUS CHAVEZ","$":727356,"f":2535,"u":44994},{"v":"MA. SOL DANIEL MUNDO","$":545453,"f":2847,"u":45963},{"v":"MARCELA OROZCO","$":399851,"f":1680,"u":25947},{"v":"JOSE DE JESUS VEGA","$":393647,"f":3949,"u":49029},{"v":"ERICK GARCIA","$":290168,"f":2363,"u":24424},{"v":"JOSE LUIS GAITAN","$":258583,"f":2181,"u":19205},{"v":"LISSETTE CASTAÑEDA","$":257314,"f":2748,"u":24931}],"marca":[{"m":"AUTONICS","$":557642},{"m":"EXTECH","$":542645},{"m":"TEKNOPOWERS","$":319795},{"m":"MINARIK","$":253603},{"m":"ALTECH CORP","$":247318},{"m":"FINDER","$":226043},{"m":"CHINT","$":218752},{"m":"INVT","$":158519},{"m":"TECO-WESTINGHOUSE","$":132123},{"m":"FLIR SYSTEMS","$":119129}],"sku":[{"s":"LGC400-10","$":93015,"u":887},{"s":"MGB400-11","$":83403,"u":559},{"s":"RHT20","$":31128,"u":224},{"s":"445703","$":29391,"u":777},{"s":"PR12-4DP","$":20419,"u":1157},{"s":"AT8N","$":18869,"u":819}],"cat":[{"c":"AUTOMATIZACION","$":958960},{"c":"CONTROL ELECTRICO","$":658691},{"c":"MEDICION PORTATIL","$":356730},{"c":"MATERIAL ELECTRICO","$":224711},{"c":"TERMOGRAFIA","$":84761},{"c":"SEÑALIZACION","$":61671},{"c":"ALIMENTACION","$":56283},{"c":"MEDICION FIJA","$":41112}],"surt":[{"n":"Luis","f":244,"i":3240,"$":31750},{"n":"Eduardo","f":190,"i":3115,"$":21837},{"n":"Juan Carlos","f":155,"i":2707,"$":21743},{"n":"Daniela","f":138,"i":1572,"$":26381},{"n":"Leonardo","f":71,"i":1085,"$":13842}]},
"2026":{"anio":2026,"meses":5,"kpis":{"total":1190893,"ecommerce":78784,"directas":1110727,"facturas":7425,"ticket":160.39,"unidades":98038,"skus":3372,"pct_ec":6.6,"pct_dir":93.3},"monthly":[{"mes":1,"l":"Ene","t":223112,"ec":13054,"dir":209694,"f":1465},{"mes":2,"l":"Feb","t":221676,"ec":13539,"dir":208137,"f":1361},{"mes":3,"l":"Mar","t":262600,"ec":29705,"dir":232336,"f":1583},{"mes":4,"l":"Abr","t":256605,"ec":12751,"dir":243683,"f":1575},{"mes":5,"l":"May","t":226900,"ec":9735,"dir":216878,"f":1441}],"vend":[{"v":"MA. SOL DANIEL MUNDO","$":340438,"f":1298,"u":22697},{"v":"JESUS CHAVEZ","$":276175,"f":1060,"u":17285},{"v":"JOSE DE JESUS VEGA","$":155072,"f":1714,"u":20697},{"v":"MARCELA OROZCO","$":113963,"f":674,"u":9083},{"v":"ERICK GARCIA","$":96019,"f":840,"u":9050},{"v":"JOSE LUIS GAITAN","$":58872,"f":752,"u":6000},{"v":"LISSETTE CASTAÑEDA","$":54942,"f":978,"u":10138}],"marca":[{"m":"AUTONICS","$":209661},{"m":"EXTECH","$":154046},{"m":"CHINT","$":104779},{"m":"ALTECH CORP","$":104186},{"m":"FINDER","$":93399},{"m":"TEKNOPOWERS","$":90553},{"m":"MINARIK","$":86574},{"m":"INVT","$":72649},{"m":"TECO-WESTINGHOUSE","$":66001},{"m":"FLIR SYSTEMS","$":48398}],"sku":[{"s":"LGC400-10","$":35440,"u":314},{"s":"MGB400-11","$":30697,"u":241},{"s":"GD200A-045G","$":16804,"u":9},{"s":"PR12-4DP","$":10942,"u":578},{"s":"AT8N","$":10699,"u":459},{"s":"445703","$":11408,"u":296}],"cat":[{"c":"AUTOMATIZACION","$":368148},{"c":"CONTROL ELECTRICO","$":259668},{"c":"MATERIAL ELECTRICO","$":88268},{"c":"MEDICION PORTATIL","$":79882},{"c":"MEDICION FIJA","$":43875},{"c":"ALIMENTACION","$":29551},{"c":"TERMOGRAFIA","$":27940},{"c":"SEÑALIZACION","$":23965}],"surt":[{"n":"Daniela","f":1572,"i":19328,"$":238004},{"n":"Luis","f":1546,"i":17750,"$":212649},{"n":"Leonardo","f":1177,"i":11701,"$":189346},{"n":"Eduardo","f":1073,"i":14442,"$":160576},{"n":"Juan Carlos","f":892,"i":11685,"$":161840},{"n":"Emmanuel","f":554,"i":7803,"$":84896}]}
};

// ── INVENTARIO DATA ──────────────────────────────────────────
const INV = {
  fecha:"2026-07-16",
  totales:{total:41593,con_stock:8074,sin_stock:33519,unidades:279552,
            negro:465,rojo:53,amarillo:212,verde:2218,sin_venta:5591},
  negro:[
    {sku:"CTS4U-N",desc:"CLEMA TERMINAL 35-40A",vel:818.2,sug:1636,prov:"ALTECH PROCESS",ult:"2025-12-17"},
    {sku:"CDL4UN",desc:"CLEMA DOBLE NIVEL 35A",vel:165.8,sug:332,prov:"ALTECH PROCESS",ult:"2025-12-16"},
    {sku:"445703",desc:"HIGROTERMOMETRO DIGITAL",vel:74.8,sug:150,prov:"FLIR COMMERCIAL SYSTEMS",ult:"2025-12-01"},
    {sku:"5507563",desc:"CONECTOR GLANDULA M20",vel:58.0,sug:116,prov:"ALTECH PROCESS",ult:"2025-09-03"},
    {sku:"INS-25",desc:"AISLADOR RESINA AWG 25MM",vel:48.4,sug:97,prov:"CIA. ELECTRONICA DIGITEL",ult:"2025-08-01"},
    {sku:"M22-R4K7",desc:"POTENCIOMETRO 22MM 4.7K",vel:29.8,sug:60,prov:"KLOEMECOM",ult:"2025-12-06"},
    {sku:"CA703",desc:"SOPORTE RIEL DIN 1 PULG",vel:26.0,sug:52,prov:"ALTECH PROCESS",ult:"2025-12-16"},
    {sku:"DIELECTRONIC PF",desc:"SPRAY LIMPIADOR 300ML",vel:26.0,sug:52,prov:"MANTENIMIENTO QUIMICO IND",ult:"2025-12-03"},
    {sku:"405281100000",desc:"RELE 2CC 110VAC 8A",vel:20.8,sug:42,prov:"RELEVADORES FINDER",ult:"2024-03-19"},
    {sku:"MSB-03",desc:"CONTRATUERCA M20 NEGRO",vel:20.6,sug:41,prov:"ALTECH PROCESS",ult:"2025-04-15"},
    {sku:"APLBW110A",desc:"LAMPARA LED GABINETE",vel:20.6,sug:41,prov:"ALTECH PROCESS",ult:"2023-10-17"},
    {sku:"V30AE000077",desc:"TERMINAL CLEMA AWG16",vel:20.6,sug:41,prov:"ALTECH PROCESS",ult:"2025-12-13"},
  ],
  rojo:[
    {sku:"CA802",desc:"TOPE RIEL DIN 35MM",stock:128,vel:358,dias:11,sug:588,prov:"ALTECH PROCESS"},
    {sku:"SA-CB",desc:"CONTACTO AUTONICS NC",stock:62,vel:128.8,dias:14,sug:196,prov:"AUTONICS MEXICO"},
    {sku:"2511120/1M",desc:"RIEL DIN ACERO 35MM 1MT",stock:42,vel:128,dias:10,sug:214,prov:"CIA. ELECTRONICA DIGITEL"},
    {sku:"345170240010",desc:"RELE 24VCD 6AMP",stock:28,vel:102.4,dias:8,sug:177,prov:"RELEVADORES FINDER"},
    {sku:"PR12-4DP",desc:"SENSOR PNP NA 4MM",stock:7,vel:101,dias:2,sug:195,prov:"AUTONICS MEXICO"},
    {sku:"405290240000",desc:"RELE 24VCD 2P2T 8AMP",stock:32,vel:88,dias:11,sug:144,prov:"RELEVADORES FINDER"},
    {sku:"SA-LA",desc:"BLOCK LED BLANCO 110-220V",stock:21,vel:75,dias:8,sug:129,prov:"AUTONICS MEXICO"},
    {sku:"REJILLA 120PF",desc:"REJILLA PLASTICA FILTRO",stock:3,vel:70,dias:1,sug:137,prov:"CIA. ELECTRONICA DIGITEL"},
    {sku:"NP2-BS542",desc:"BOTON HONGO PARO EMERGENCIA",stock:1,vel:64.4,dias:0,sug:128,prov:"CIA. ELECTRONICA DIGITEL"},
    {sku:"CA722/10",desc:"PUENTE 10 POLOS",stock:6,vel:53,dias:3,sug:100,prov:"ALTECH PROCESS"},
    {sku:"CA721/10",desc:"PUENTE 10 POLOS",stock:12,vel:39.2,dias:9,sug:66,prov:"ALTECH PROCESS"},
    {sku:"553290240040",desc:"RELE 24VCD 2P2T 10AMP",stock:6,vel:32.8,dias:5,sug:60,prov:"RELEVADORES FINDER"},
    {sku:"M22-D-G",desc:"PULSADOR PLANO VERDE 22MM",stock:10,vel:30.4,dias:10,sug:51,prov:"KLOEMECOM"},
    {sku:"S2SR-S3W",desc:"SELECTOR 2POS MANIJA CORTA",stock:1,vel:28.8,dias:1,sug:57,prov:"AUTONICS MEXICO"},
  ],
  prov:[
    {p:"CIA. ELECTRONICA DIGITEL",skus:149,sug:1445},
    {p:"ALTECH PROCESS",skus:64,sug:3485},
    {p:"AUTONICS MEXICO",skus:49,sug:710},
    {p:"FLIR COMMERCIAL SYSTEMS",skus:32,sug:195},
    {p:"RELEVADORES FINDER",skus:21,sug:629},
    {p:"KLOEMECOM",skus:6,sug:167},
  ],
  sobrestock:[
    {sku:"MUESTRAS",desc:"PARTES Y ACCESORIOS",stock:8828,vel:1.6,dias:165525},
    {sku:"110-0038-MMR",desc:"DIAL REDONDO 40MM METAL",stock:1587,vel:0.6,dias:79350},
    {sku:"CA12-V",desc:"CABLE AUTOMOTRIZ 12 VERDE",stock:426,vel:0.4,dias:31950},
    {sku:"TP-TC 3/32\"",desc:"TUBO TERMOCONTRACTIL 3/32\"",stock:376,vel:0.6,dias:18800},
    {sku:"CA12-R",desc:"CABLE AUTOMOTRIZ 12 ROJO",stock:672,vel:1.2,dias:16800},
  ]
};

// ── Palette ──────────────────────────────────────────────────
const C={bg:"#060d1a",surf:"#0b1628",card:"#0f1e35",border:"#162338",
         blue:"#38bdf8",amber:"#f59e0b",emerald:"#10b981",
         rose:"#f43f5e",violet:"#8b5cf6",orange:"#f97316",cyan:"#22d3ee",
         negro:"#1a1a2e",rojo:"#f43f5e",amarillo:"#f59e0b",verde:"#10b981",
         t1:"#e2eeff",t2:"#94a3b8",t3:"#4a6080"};
const PAL=[C.blue,C.emerald,C.amber,C.violet,C.rose,C.orange,C.cyan,"#a3e635","#fb7185","#c084fc"];

const fUSD=v=>v>=1e6?`$${(v/1e6).toFixed(2)}M`:v>=1e3?`$${(v/1e3).toFixed(0)}K`:`$${Math.round(v)}`;
const fN=v=>v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1e3?`${(v/1e3).toFixed(0)}K`:String(Math.round(v));

// ── Sub-components ───────────────────────────────────────────
function Sel({label,val,setVal,opts}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:3,minWidth:100}}>
      <span style={{fontSize:9,color:C.t3,letterSpacing:1.5,textTransform:"uppercase"}}>{label}</span>
      <select value={val} onChange={e=>setVal(e.target.value)}
        style={{background:C.surf,border:`1px solid ${val?C.blue:C.border}`,color:val?C.t1:C.t2,
                borderRadius:5,padding:"5px 22px 5px 8px",fontSize:12,outline:"none",cursor:"pointer",
                WebkitAppearance:"none",
                backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%2394a3b8'/%3E%3C/svg%3E")`,
                backgroundRepeat:"no-repeat",backgroundPosition:"right 8px center"}}>
        <option value="">Todos</option>
        {opts.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function KPI({label,val,sub,color,trend,chip,alert}){
  return(
    <div style={{background:alert?`${color}12`:C.card,
                 border:`1px solid ${alert?color:C.border}`,
                 borderTop:`2px solid ${color}`,
                 borderRadius:8,padding:"12px 14px",flex:1,minWidth:125}}>
      <div style={{fontSize:9,color:C.t3,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>{label}</div>
      <div style={{fontSize:20,fontWeight:700,color:alert?color:C.t1,fontFamily:"'DM Mono',monospace",lineHeight:1}}>{val}</div>
      {sub&&<div style={{fontSize:10,color:C.t2,marginTop:4}}>{sub}</div>}
      {trend!=null&&(<div style={{fontSize:11,fontWeight:600,marginTop:4,color:trend>=0?C.emerald:C.rose}}>
        {trend>=0?"▲":"▼"}{Math.abs(trend).toFixed(1)}% vs 2025</div>)}
      {chip&&<div style={{display:"inline-block",marginTop:4,fontSize:9,fontWeight:600,
                          color,background:`${color}22`,border:`1px solid ${color}44`,
                          borderRadius:4,padding:"1px 6px"}}>{chip}</div>}
    </div>
  );
}

function Card({title,sub,children,accent}){
  return(
    <div style={{background:C.card,border:`1px solid ${accent||C.border}`,
                 borderRadius:10,padding:"14px 16px",display:"flex",flexDirection:"column"}}>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:600,color:accent?C.t1:C.t1}}>{title}</div>
        {sub&&<div style={{fontSize:10,color:C.t3,marginTop:1}}>{sub}</div>}
      </div>
      <div style={{flex:1}}>{children}</div>
    </div>
  );
}

function BarH({data,keyX,keyY,color}){
  const mx=Math.max(...data.map(d=>d[keyY]||0));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {data.map((d,i)=>(
        <div key={i}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
            <span style={{fontSize:10,color:i===0?C.t1:C.t2,fontWeight:i===0?700:400,
                          maxWidth:"58%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {d[keyX]}
            </span>
            <span style={{fontSize:10,color:C.t1,fontFamily:"monospace"}}>{fUSD(d[keyY])}</span>
          </div>
          <div style={{background:C.border,borderRadius:3,height:5}}>
            <div style={{width:`${(d[keyY]/mx*100).toFixed(1)}%`,height:"100%",
                         background:i===0?color:`${color}55`,borderRadius:3}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function Tabs({tabs,active,setActive}){
  return(
    <div style={{display:"flex",gap:2,background:C.surf,padding:3,borderRadius:8,border:`1px solid ${C.border}`,flexWrap:"wrap"}}>
      {tabs.map(t=>(
        <button key={t} onClick={()=>setActive(t)}
          style={{padding:"5px 12px",fontSize:11,fontWeight:active===t?700:400,
                  color:active===t?C.t1:C.t3,background:active===t?C.card:"transparent",
                  border:`1px solid ${active===t?C.border:"transparent"}`,
                  borderRadius:6,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>
          {t}
        </button>
      ))}
    </div>
  );
}

const TT=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(
    <div style={{background:"#1a2d48",border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 12px",fontSize:11}}>
      <div style={{color:C.t2,marginBottom:3}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,fontFamily:"monospace"}}>
          {p.name}: <b>${typeof p.value==="number"?p.value.toLocaleString("en-US",{maximumFractionDigits:0}):p.value}</b>
        </div>
      ))}
    </div>
  );
};

// ── Semáforo badge ────────────────────────────────────────────
function Sem({v}){
  const cfg={
    NEGRO:  {bg:"#0d0d1a",border:"#6366f1",color:"#a5b4fc",icon:"⚫"},
    ROJO:   {bg:"#1a0a0a",border:C.rose,   color:C.rose,    icon:"🔴"},
    AMARILLO:{bg:"#1a1400",border:C.amber,  color:C.amber,   icon:"🟡"},
    VERDE:  {bg:"#0a1a0d",border:C.emerald, color:C.emerald, icon:"🟢"},
  }[v]||{bg:C.surf,border:C.border,color:C.t3,icon:"⬜"};
  return(
    <span style={{display:"inline-block",padding:"1px 7px",borderRadius:4,fontSize:10,fontWeight:700,
                  background:cfg.bg,border:`1px solid ${cfg.border}`,color:cfg.color}}>
      {cfg.icon} {v}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════
export default function Dashboard(){
  const [anio,   setAnio]   = useState("2026");
  const [fMes,   setFMes]   = useState("");
  const [fVend,  setFVend]  = useState("");
  const [fMarca, setFMarca] = useState("");
  const [tab,    setTab]    = useState("Ventas");

  const TABS=["Ventas","E-Commerce","Vendedores","Almacén","Inventario","Compras"];
  const d   = VENTAS[anio];
  const d25 = VENTAS["2025"];

  const monthly = useMemo(()=>fMes?d.monthly.filter(r=>r.l===fMes):d.monthly,[d,fMes]);
  const totF = monthly.reduce((s,r)=>s+r.t,0);
  const ecF  = monthly.reduce((s,r)=>s+r.ec,0);
  const dirF = monthly.reduce((s,r)=>s+r.dir,0);

  const yoyChart = useMemo(()=>d.monthly.map(r=>{
    const r25=d25.monthly.find(x=>x.mes===r.mes);
    return{l:r.l,[anio]:r.t,"2025":r25?r25.t:0};
  }),[d,d25,anio]);

  const surt=d.surt;
  const surtF=surt.reduce((s,r)=>s+r.f,0);
  const surtI=surt.reduce((s,r)=>s+r.i,0);

  const isPartial=anio==="2026";
  const enesMay25=d25.monthly.filter(r=>r.mes<=d.meses).reduce((s,r)=>s+r.t,0);
  const yoyT=isPartial?((d.kpis.total-enesMay25)/enesMay25*100):null;

  // Alertas count
  const alertTotal = INV.totales.negro + INV.totales.rojo;

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:C.t2}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <div style={{background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"10px 20px",
                   display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:99,flexWrap:"wrap",rowGap:8}}>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:C.t1}}>
            <span style={{color:C.blue,marginRight:4}}>◈</span>ACOTRON
          </div>
          <div style={{fontSize:9,color:C.t3,letterSpacing:2}}>DASHBOARD MAESTRO v5 · {new Date().toLocaleDateString('es-MX')}</div>
        </div>
        <div style={{width:1,height:28,background:C.border}}/>

        <div style={{display:"flex",gap:3}}>
          {["2025","2026"].map(a=>(
            <button key={a} onClick={()=>{setAnio(a);setFMes("");setFMarca("");setFVend("");}}
              style={{padding:"5px 14px",fontSize:11,fontWeight:anio===a?700:400,
                      color:anio===a?C.t1:C.t3,background:anio===a?`${C.blue}22`:"transparent",
                      border:`1px solid ${anio===a?C.blue:C.border}`,borderRadius:6,cursor:"pointer"}}>
              {a}{a==="2026"?" ↗ Ene–May":"  Año Completo"}
            </button>
          ))}
        </div>

        <div style={{width:1,height:28,background:C.border}}/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
          <Sel label="Mes"      val={fMes}   setVal={setFMes}   opts={d.monthly.map(r=>r.l)}/>
          <Sel label="Vendedor" val={fVend}  setVal={setFVend}  opts={d.vend.map(v=>v.v)}/>
          <Sel label="Marca"    val={fMarca} setVal={setFMarca} opts={d.marca.map(m=>m.m)}/>
        </div>

        {/* Alerta inventario badge */}
        <div style={{marginLeft:"auto",background:`${C.rose}18`,border:`1px solid ${C.rose}55`,
                     borderRadius:8,padding:"6px 12px",cursor:"pointer",whiteSpace:"nowrap"}}
             onClick={()=>setTab("Inventario")}>
          <div style={{fontSize:9,color:C.t3,letterSpacing:1}}>ALERTAS STOCK</div>
          <div style={{fontSize:14,color:C.rose,fontWeight:700}}>
            ⚫{INV.totales.negro} 🔴{INV.totales.rojo} 🟡{INV.totales.amarillo}
          </div>
        </div>

        <Tabs tabs={TABS} active={tab} setActive={setTab}/>
      </div>

      <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:14}}>

        {/* 2026 alert */}
        {isPartial&&tab==="Ventas"&&(
          <div style={{background:`${C.amber}15`,border:`1px solid ${C.amber}44`,borderRadius:8,
                       padding:"7px 14px",fontSize:11,color:C.amber,display:"flex",gap:8,alignItems:"center"}}>
            ⚠ <b>2026 parcial (Ene–May · SAI)</b> — E-Commerce refleja solo canal WEB del SAI. Falta cargar ODOO 2026 para comparativo real de e-commerce.
          </div>
        )}

        {/* ═══ TAB: VENTAS ═══ */}
        {tab==="Ventas"&&(
          <>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <KPI label="Ventas Totales" val={fUSD(totF)} sub={`${d.kpis.facturas.toLocaleString()} facturas`} color={C.blue} trend={isPartial?yoyT:null}/>
              <KPI label="Ticket Promedio" val={`$${d.kpis.ticket}`} sub="USD/factura" color={C.emerald}
                   trend={isPartial?((d.kpis.ticket-d25.kpis.ticket)/d25.kpis.ticket*100):null}/>
              <KPI label="E-Commerce" val={fUSD(ecF)} sub={isPartial?"SAI-WEB (sin ODOO 2026)":"SAI-WEB + ODOO"} color={C.violet} chip={`${d.kpis.pct_ec}%`}/>
              <KPI label="Ventas Directas" val={fUSD(dirF)} sub="Vendedores SAI" color={C.emerald} chip={`${d.kpis.pct_dir}%`}/>
              <KPI label="Unidades" val={fN(d.kpis.unidades)} sub="piezas" color={C.amber}/>
              <KPI label="SKUs Activos" val={d.kpis.skus.toLocaleString()} sub="con venta" color={C.cyan}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Card title={`Ventas Mensuales ${anio}`} sub="E-Commerce + Directas · USD sin IVA">
                <ResponsiveContainer width="100%" height={195}>
                  <AreaChart data={monthly} margin={{top:4,right:4,left:-14,bottom:0}}>
                    <defs>
                      <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.emerald} stopOpacity={.3}/>
                        <stop offset="95%" stopColor={C.emerald} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.violet} stopOpacity={.3}/>
                        <stop offset="95%" stopColor={C.violet} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                    <XAxis dataKey="l" tick={{fill:C.t3,fontSize:10}} tickLine={false}/>
                    <YAxis tick={{fill:C.t3,fontSize:10}} tickLine={false} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`}/>
                    <Tooltip content={<TT/>}/>
                    <Legend iconType="square" wrapperStyle={{fontSize:10}}/>
                    <Area type="monotone" dataKey="dir" name="Ventas Directas" stroke={C.emerald} strokeWidth={2} fill="url(#gD)" dot={false}/>
                    <Area type="monotone" dataKey="ec"  name="E-Commerce"      stroke={C.violet}  strokeWidth={2} fill="url(#gE)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Comparativo 2025 vs 2026" sub="Mismo período · USD">
                <ResponsiveContainer width="100%" height={195}>
                  <BarChart data={yoyChart} margin={{left:-14,right:4}}>
                    <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                    <XAxis dataKey="l" tick={{fill:C.t3,fontSize:10}} tickLine={false}/>
                    <YAxis tick={{fill:C.t3,fontSize:10}} tickLine={false} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`}/>
                    <Tooltip content={<TT/>}/>
                    <Legend iconType="square" wrapperStyle={{fontSize:10}}/>
                    <Bar dataKey="2025" name="2025" fill={`${C.blue}44`} radius={[3,3,0,0]}/>
                    <Bar dataKey={anio}  name={anio}  fill={C.blue}       radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              <Card title="Top Marcas" sub="USD">
                <BarH data={(fMarca?d.marca.filter(m=>m.m===fMarca):d.marca).slice(0,7)} keyX="m" keyY="$" color={C.blue}/>
              </Card>
              <Card title="Top Categorías" sub="USD">
                <BarH data={d.cat.slice(0,7)} keyX="c" keyY="$" color={C.amber}/>
              </Card>
              <Card title="Top SKUs" sub="USD">
                <BarH data={d.sku.slice(0,6)} keyX="s" keyY="$" color={C.emerald}/>
              </Card>
            </div>
          </>
        )}

        {/* ═══ TAB: E-COMMERCE ═══ */}
        {tab==="E-Commerce"&&(
          <>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <KPI label="E-Commerce Total" val={fUSD(d.kpis.ecommerce)} sub={isPartial?"Solo SAI-WEB":"SAI-WEB + ODOO ML+AMZ"} color={C.violet}/>
              {!isPartial&&<KPI label="ODOO 2025" val={fUSD(562482)} sub="ML+Amazon · MXN÷TC" color={C.blue}/>}
              <KPI label="SAI-WEB" val={fUSD(isPartial?78784:213588)} sub="nombre_ext=WEB" color={C.cyan}/>
              <KPI label="% E-Commerce" val={`${d.kpis.pct_ec}%`} sub="del total" color={C.rose}/>
            </div>
            <Card title="E-Commerce vs Directas por Mes" sub="USD · stackeado">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={d.monthly} margin={{left:-14,right:4}}>
                  <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                  <XAxis dataKey="l" tick={{fill:C.t3,fontSize:10}} tickLine={false}/>
                  <YAxis tick={{fill:C.t3,fontSize:10}} tickLine={false} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`}/>
                  <Tooltip content={<TT/>}/>
                  <Legend iconType="square" wrapperStyle={{fontSize:10}}/>
                  <Bar dataKey="dir" name="Ventas Directas" stackId="a" fill={C.emerald} radius={[0,0,0,0]}/>
                  <Bar dataKey="ec"  name="E-Commerce"      stackId="a" fill={C.violet}  radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}

        {/* ═══ TAB: VENDEDORES ═══ */}
        {tab==="Vendedores"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card title={`Ranking Vendedores ${anio}`} sub="USD directas SAI">
              {(fVend?d.vend.filter(v=>v.v===fVend):d.vend).map((v,i)=>{
                const mx=d.vend[0].$;
                const v25=d25.vend.find(r=>r.v===v.v);
                const tr=v25?((v.$-v25.$*(d.meses/12))/(v25.$*(d.meses/12))*100):null;
                return(
                  <div key={i} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:10,color:i===0?C.t1:C.t2,fontWeight:i===0?700:400}}>
                        {v.v.split(" ").slice(0,3).join(" ")}
                      </span>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        {tr!=null&&<span style={{fontSize:9,color:tr>=0?C.emerald:C.rose,fontWeight:700}}>
                          {tr>=0?"▲":"▼"}{Math.abs(tr).toFixed(0)}%
                        </span>}
                        <span style={{fontSize:10,color:C.t1,fontFamily:"monospace"}}>{fUSD(v.$)}</span>
                      </div>
                    </div>
                    <div style={{background:C.border,borderRadius:3,height:5}}>
                      <div style={{width:`${(v.$/mx*100).toFixed(1)}%`,height:"100%",
                                   background:i===0?C.emerald:`${C.emerald}55`,borderRadius:3}}/>
                    </div>
                    <div style={{fontSize:9,color:C.t3,marginTop:2}}>{v.f.toLocaleString()} facturas · {fN(v.u)} unidades</div>
                  </div>
                );
              })}
            </Card>
            <Card title="Facturas por Vendedor" sub="Volumen operativo">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.vend} layout="vertical" margin={{left:6,right:40}}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.t3,fontSize:9}}/>
                  <YAxis type="category" dataKey="v" tick={{fill:C.t2,fontSize:9}} width={110}
                         tickFormatter={v=>v.split(" ").slice(0,2).join(" ")}/>
                  <Tooltip content={<TT/>}/>
                  <Bar dataKey="f" name="Facturas" radius={[0,4,4,0]}>
                    {d.vend.map((_,i)=><Cell key={i} fill={PAL[i%PAL.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ═══ TAB: ALMACÉN ═══ */}
        {tab==="Almacén"&&(
          <>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <KPI label="Facturas Surtidas" val={surtF.toLocaleString()} sub="con surtidor asignado" color={C.blue}/>
              <KPI label="Ítems Despachados" val={fN(surtI)} sub="unidades" color={C.emerald}/>
              <KPI label="Surtidores Activos" val={surt.length} sub="empleados" color={C.amber}/>
              <KPI label="Promedio/Surtidor" val={Math.round(surtF/surt.length)} sub="facturas" color={C.violet}/>
            </div>
            <Card title={`Bonus Tracking — Surtidores ${anio}`} sub="nombre_ext003 · facturas e ítems">
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{borderBottom:`2px solid ${C.border}`}}>
                    {["Surtidor","Facturas","Ítems","Ventas USD","% Fact","% Ítems"].map(h=>(
                      <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,color:C.t3,letterSpacing:1,textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {surt.map((s,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?`${C.surf}44`:"transparent"}}>
                      <td style={{padding:"8px 10px",color:C.t1,fontWeight:700}}>{s.n}</td>
                      <td style={{padding:"8px 10px"}}>
                        <span style={{color:C.t1,fontFamily:"monospace"}}>{s.f}</span>
                        <div style={{marginTop:2,background:C.border,borderRadius:2,height:4,width:70}}>
                          <div style={{width:`${(s.f/surtF*100).toFixed(0)}%`,height:"100%",background:C.blue,borderRadius:2}}/>
                        </div>
                      </td>
                      <td style={{padding:"8px 10px"}}>
                        <span style={{color:C.t1,fontFamily:"monospace"}}>{s.i.toLocaleString()}</span>
                        <div style={{marginTop:2,background:C.border,borderRadius:2,height:4,width:70}}>
                          <div style={{width:`${(s.i/surtI*100).toFixed(0)}%`,height:"100%",background:C.emerald,borderRadius:2}}/>
                        </div>
                      </td>
                      <td style={{padding:"8px 10px",color:C.amber,fontFamily:"monospace"}}>{fUSD(s.$)}</td>
                      <td style={{padding:"8px 10px",color:C.t2,fontFamily:"monospace"}}>{(s.f/surtF*100).toFixed(1)}%</td>
                      <td style={{padding:"8px 10px",color:C.t2,fontFamily:"monospace"}}>{(s.i/surtI*100).toFixed(1)}%</td>
                    </tr>
                  ))}
                  <tr style={{borderTop:`2px solid ${C.border}`,background:`${C.surf}88`}}>
                    <td style={{padding:"8px 10px",color:C.t1,fontWeight:700}}>TOTAL</td>
                    <td style={{padding:"8px 10px",color:C.blue,fontWeight:700,fontFamily:"monospace"}}>{surtF}</td>
                    <td style={{padding:"8px 10px",color:C.emerald,fontWeight:700,fontFamily:"monospace"}}>{surtI.toLocaleString()}</td>
                    <td style={{padding:"8px 10px",color:C.amber,fontWeight:700,fontFamily:"monospace"}}>{fUSD(surt.reduce((s,r)=>s+r.$,0))}</td>
                    <td colSpan={2} style={{padding:"8px 10px",color:C.t3,fontSize:10}}>100%</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </>
        )}

        {/* ═══ TAB: INVENTARIO ═══ */}
        {tab==="Inventario"&&(
          <>
            {/* Semáforo KPIs */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <KPI label="⚫ NEGRO · Sin Stock + Demanda" val={INV.totales.negro} sub="compra urgente HOY" color="#6366f1" alert/>
              <KPI label="🔴 ROJO · ≤15 días cobertura"  val={INV.totales.rojo}  sub="compra en 48h"     color={C.rose}  alert/>
              <KPI label="🟡 AMARILLO · 16-45 días"       val={INV.totales.amarillo} sub="planear compra" color={C.amber}/>
              <KPI label="🟢 VERDE · Saludable"            val={INV.totales.verde}  sub=">45 días"        color={C.emerald}/>
              <KPI label="SKUs Sin Venta (stock muerto)"   val={INV.totales.sin_venta} sub="revisar liquidar" color={C.t3}/>
              <KPI label="Unidades en Stock"               val={fN(INV.totales.unidades)} sub="total almacén 16-Jul" color={C.blue}/>
            </div>

            {/* Semáforo donut */}
            <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14}}>
              <Card title="Distribución Semáforo" sub="SKUs con demanda activa">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={[
                      {name:"NEGRO",value:INV.totales.negro},
                      {name:"ROJO",value:INV.totales.rojo},
                      {name:"AMARILLO",value:INV.totales.amarillo},
                      {name:"VERDE",value:INV.totales.verde},
                    ]} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={2}>
                      <Cell fill="#6366f1"/>
                      <Cell fill={C.rose}/>
                      <Cell fill={C.amber}/>
                      <Cell fill={C.emerald}/>
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>
                  {[["⚫ NEGRO","#6366f1",INV.totales.negro],["🔴 ROJO",C.rose,INV.totales.rojo],
                    ["🟡 AMARILLO",C.amber,INV.totales.amarillo],["🟢 VERDE",C.emerald,INV.totales.verde]].map(([l,c,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:10,color:C.t2}}>{l}</span>
                      <span style={{fontSize:10,color:c,fontFamily:"monospace",fontWeight:700}}>{v} SKUs</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="⚫ SKUs NEGRO — Sin stock con demanda activa" sub={`${INV.totales.negro} productos · COMPRA URGENTE · velocidad = prom. mensual Ene-May 2026`} accent="#6366f1">
                <div style={{overflowX:"auto",maxHeight:260,overflowY:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead style={{position:"sticky",top:0,background:C.card}}>
                      <tr style={{borderBottom:`2px solid ${C.border}`}}>
                        {["SKU","Descripción","Vel/mes","Sug. Compra","Proveedor","Últ. Compra"].map(h=>(
                          <th key={h} style={{padding:"6px 8px",textAlign:"left",fontSize:9,color:C.t3,textTransform:"uppercase"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {INV.negro.map((r,i)=>(
                        <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?`${C.surf}44`:"transparent"}}>
                          <td style={{padding:"6px 8px",color:"#a5b4fc",fontFamily:"monospace",fontWeight:700,whiteSpace:"nowrap"}}>{r.sku}</td>
                          <td style={{padding:"6px 8px",color:C.t2,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.desc}</td>
                          <td style={{padding:"6px 8px",color:C.rose,fontFamily:"monospace",fontWeight:700}}>{r.vel}</td>
                          <td style={{padding:"6px 8px",color:"#a5b4fc",fontFamily:"monospace",fontWeight:700}}>{r.sug} pzas</td>
                          <td style={{padding:"6px 8px",color:C.t2,fontSize:10,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.prov}</td>
                          <td style={{padding:"6px 8px",color:C.amber,fontFamily:"monospace",fontSize:10}}>{r.ult||"—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* ROJO table */}
            <Card title="🔴 SKUs ROJO — Menos de 15 días de cobertura" sub="Ordenar en las próximas 48 horas" accent={C.rose}>
              <div style={{overflowX:"auto",maxHeight:240,overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead style={{position:"sticky",top:0,background:C.card}}>
                    <tr style={{borderBottom:`2px solid ${C.border}`}}>
                      {["SKU","Descripción","Stock","Vel/mes","Días","Sug.","Proveedor"].map(h=>(
                        <th key={h} style={{padding:"6px 8px",textAlign:"left",fontSize:9,color:C.t3,textTransform:"uppercase"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {INV.rojo.map((r,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?`${C.surf}44`:"transparent"}}>
                        <td style={{padding:"6px 8px",color:C.rose,fontFamily:"monospace",fontWeight:700,whiteSpace:"nowrap"}}>{r.sku}</td>
                        <td style={{padding:"6px 8px",color:C.t2,maxWidth:155,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.desc}</td>
                        <td style={{padding:"6px 8px",color:C.t1,fontFamily:"monospace"}}>{r.stock}</td>
                        <td style={{padding:"6px 8px",color:C.rose,fontFamily:"monospace",fontWeight:700}}>{r.vel}</td>
                        <td style={{padding:"6px 8px"}}>
                          <span style={{color:r.dias<=3?C.rose:C.amber,fontFamily:"monospace",fontWeight:700}}>{r.dias}d</span>
                        </td>
                        <td style={{padding:"6px 8px",color:C.amber,fontFamily:"monospace",fontWeight:700}}>{r.sug}</td>
                        <td style={{padding:"6px 8px",color:C.t2,fontSize:10,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.prov}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* ═══ TAB: COMPRAS ═══ */}
        {tab==="Compras"&&(
          <>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <KPI label="SKUs críticos (⚫+🔴)" val={alertTotal} sub="requieren orden de compra" color={C.rose} alert/>
              <KPI label="Proveedores urgentes" val={INV.prov.length} sub="con SKUs críticos" color={C.amber}/>
              <KPI label="Vel. máxima (CTS4U-N)" val="818 pzas/mes" sub="sin stock → prioridad #1" color="#6366f1"/>
              <KPI label="Cobertura objetivo" val="60 días" sub="base para cálculo de compra" color={C.cyan}/>
            </div>

            {/* Por proveedor */}
            <Card title="Proveedores a Contactar — Prioridad por SKUs Críticos" sub="Ordenar de mayor a menor urgencia">
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {INV.prov.map((p,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px 100px",
                                       alignItems:"center",padding:"10px 0",
                                       borderBottom:`1px solid ${C.border}`}}>
                    <div>
                      <div style={{fontSize:12,color:C.t1,fontWeight:i===0?700:500}}>{p.p}</div>
                      <div style={{fontSize:10,color:C.t3,marginTop:2}}>
                        {p.skus} SKUs críticos · {p.sug.toLocaleString()} pzas sugeridas
                      </div>
                      <div style={{marginTop:5,background:C.border,borderRadius:3,height:4,maxWidth:300}}>
                        <div style={{width:`${(p.skus/INV.prov[0].skus*100).toFixed(0)}%`,height:"100%",
                                     background:i===0?"#6366f1":C.rose,borderRadius:3}}/>
                      </div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:800,color:i===0?"#a5b4fc":C.rose,fontFamily:"monospace"}}>{p.skus}</div>
                      <div style={{fontSize:9,color:C.t3}}>SKUs</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.amber,fontFamily:"monospace"}}>{p.sug.toLocaleString()}</div>
                      <div style={{fontSize:9,color:C.t3}}>pzas sugeridas</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sobrestock warning */}
            <Card title="⚠ Sobrestock — Capital Inmovilizado" sub="SKUs con +6 meses de cobertura y baja rotación">
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:`2px solid ${C.border}`}}>
                      {["SKU","Descripción","Stock","Vel/mes","Días cobertura"].map(h=>(
                        <th key={h} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:C.t3,textTransform:"uppercase"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {INV.sobrestock.map((r,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?`${C.surf}44`:"transparent"}}>
                        <td style={{padding:"6px 10px",color:C.amber,fontFamily:"monospace",fontWeight:700}}>{r.sku}</td>
                        <td style={{padding:"6px 10px",color:C.t2}}>{r.desc}</td>
                        <td style={{padding:"6px 10px",color:C.t1,fontFamily:"monospace"}}>{r.stock.toLocaleString()}</td>
                        <td style={{padding:"6px 10px",color:C.t2,fontFamily:"monospace"}}>{r.vel}</td>
                        <td style={{padding:"6px 10px"}}>
                          <span style={{color:C.amber,fontFamily:"monospace",fontWeight:700,fontSize:12}}>{r.dias.toLocaleString()}d</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{marginTop:10,fontSize:11,color:C.t3,padding:"8px 12px",
                           background:`${C.amber}12`,border:`1px solid ${C.amber}33`,borderRadius:6}}>
                💡 Estos SKUs representan capital inmovilizado. Considera liquidación, descuentos agresivos o devolución a proveedor.
              </div>
            </Card>
          </>
        )}

        {/* FOOTER */}
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,
                     display:"flex",justifyContent:"space-between",fontSize:10,color:C.t3,flexWrap:"wrap",gap:6}}>
          <span>ACOTRON · Dashboard Maestro v5.0 · Actualizado 17-Jul-2026</span>
          <span>SAI: subt_fac÷tip_cam_real · ODOO: MXN÷TC_mes · Inv. corte 16-Jul</span>
          <span style={{color:C.rose}}>⚫{INV.totales.negro} ⚠ SKUs sin stock con demanda — comprar HOY</span>
        </div>
      </div>
    </div>
  );
}
