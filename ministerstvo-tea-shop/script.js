const seedProducts=[
{id:1,name:"Южный чёрный чай",category:"Чай",price:390,description:"Насыщенный вкус и мягкий аромат для уютных вечеров.",emoji:"🫖",available:true},
{id:2,name:"Травяной сбор",category:"Чай",price:320,description:"Душистый сбор с лёгкими природными нотами.",emoji:"🌿",available:true},
{id:3,name:"Медовые конфеты",category:"Сладости",price:250,description:"Небольшое сладкое удовольствие к чашке чая.",emoji:"🍯",available:true},
{id:4,name:"Домашнее печенье",category:"Сладости",price:290,description:"Хрустящее, ароматное и по-домашнему уютное.",emoji:"🍪",available:false},
{id:5,name:"Подарочный набор",category:"Другое",price:890,description:"Тёплый подарок для тех, кто дорог.",emoji:"🎁",available:true},
{id:6,name:"Чайная коллекция",category:"Чай",price:540,description:"Подборка интересных вкусов для знакомства.",emoji:"🍵",available:true}
];
let products=JSON.parse(localStorage.getItem("ministerstvoProducts")||"null")||seedProducts;
let currentFilter="Все";
const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem("ministerstvoProducts",JSON.stringify(products));
function seasonNow(){const m=new Date().getMonth()+1;return m>=3&&m<=5?"spring":m>=6&&m<=8?"summer":m>=9&&m<=11?"autumn":"winter"}
const seasonNames={spring:"Весеннее настроение",summer:"Южное настроение в каждой детали",autumn:"Время тёплых историй",winter:"Тепло даже в холодный день"};
function setSeason(value){const season=value==="auto"?seasonNow():value;document.body.dataset.season=season;$("#seasonSelect").value=value;document.querySelectorAll("[data-pick-season]").forEach(b=>b.classList.toggle("selected",b.dataset.pickSeason===season));$("#seasonCaption").textContent=seasonNames[season];localStorage.setItem("ministerstvoSeason",value)}
function renderProducts(){const list=products.filter(p=>(currentFilter==="Все"||p.category===currentFilter));$("#productGrid").innerHTML=list.map(p=>`<article class="product-card"><div class="product-art"><span class="product-tag">${p.category}</span>${p.available?"":'<span class="unavailable">Нет в наличии</span>'}<span class="product-emoji">${p.emoji||"✦"}</span></div><div class="product-info"><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description||"Подробности уточняйте при заказе.")}</p><div class="product-bottom"><span class="price">${Number(p.price).toLocaleString("ru-RU")} ₽</span>${p.available?`<a class="order-link" href="tel:+79298404420">Заказать ↗</a>`:'<span class="order-link disabled">Скоро появится</span>'}</div></div></article>`).join("");$("#itemsCount").textContent=`${list.length} ${plural(list.length)}`;$("#emptyState").hidden=list.length>0}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function plural(n){return n===1?"товар":n>=2&&n<=4?"товара":"товаров"}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function open(id){$(id).classList.add("open")}function closeAll(){$$(".overlay,.modal-overlay").forEach(x=>x.classList.remove("open"))}function $$(s){return [...document.querySelectorAll(s)]}
$("#year").textContent=new Date().getFullYear();
setSeason(localStorage.getItem("ministerstvoSeason")||"auto");renderProducts();
$("#settingsOpen").onclick=()=>open("#settingsOverlay");
$("#loginOpen").onclick=()=>{closeAll();open("#loginOverlay")};
$$("[data-close]").forEach(b=>b.onclick=closeAll);
$$(".overlay,.modal-overlay").forEach(o=>o.addEventListener("click",e=>{if(e.target===o)closeAll()}));
$("#seasonSelect").onchange=e=>setSeason(e.target.value);
$$("[data-pick-season]").forEach(b=>b.onclick=()=>setSeason(b.dataset.pickSeason));
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;currentFilter=b.dataset.filter;$$(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
$("#loginForm").onsubmit=e=>{e.preventDefault();toast("Авторизация ещё не подключена. Используйте демо-панель.");};
$("#demoAdmin").onclick=()=>{closeAll();open("#adminOverlay");renderAdmin()};
$("#exitAdmin").onclick=closeAll;
function renderAdmin(){$("#adminList").innerHTML=products.map(p=>`<div class="admin-row"><span>${escapeHTML(p.name)} · ${p.available?"в наличии":"нет в наличии"}</span><span><button data-edit="${p.id}">Изменить</button><button data-delete="${p.id}">Удалить</button></span></div>`).join("");}
$("#adminList").onclick=e=>{const edit=e.target.dataset.edit,del=e.target.dataset.delete;if(edit){const p=products.find(x=>x.id===Number(edit));$("#editId").value=p.id;$("#productName").value=p.name;$("#productPrice").value=p.price;$("#productCategory").value=p.category;$("#productDescription").value=p.description;$("#productAvailable").checked=p.available;$("#productForm button[type=submit]").textContent="Обновить товар ✓"}if(del){products=products.filter(x=>x.id!==Number(del));save();renderAdmin();renderProducts();toast("Товар удалён из локального каталога")}};
$("#productForm").onsubmit=e=>{e.preventDefault();const id=Number($("#editId").value);const old=products.find(p=>p.id===id);const item={id:id||Date.now(),name:$("#productName").value.trim(),price:Number($("#productPrice").value),category:$("#productCategory").value,description:$("#productDescription").value.trim(),emoji:old?.emoji||"✦",available:$("#productAvailable").checked};if(id)products=products.map(p=>p.id===id?item:p);else products.push(item);save();renderAdmin();renderProducts();e.target.reset();$("#editId").value="";$("#productForm button[type=submit]").textContent="Сохранить товар ✓";toast("Изменения сохранены в этом браузере")};
$("#menuToggle").onclick=()=>$(".nav").classList.toggle("open");
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));
