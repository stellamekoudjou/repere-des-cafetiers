'use strict';
const $ = id => document.getElementById(id);
const format = n => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
const categoryInitials = {'Œufs':'Œ','Produits d’accompagnement':'A','Liquides':'B'};
const PHONE='237673714759';
let category='Tous';
let cart={};
try { cart=JSON.parse(localStorage.getItem('repere_cart_v2')||'{}'); } catch {cart={};}
let selected={};
let toastTimeout;
const clean = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('show'),2300)}
function variants(p){return [{key:'retail',name:'Prix normal',price:p.retail},...(p.wholesale!=null?[{key:'wholesale',name:'Prix de gros / quantité',price:p.wholesale}]:[])];}
function getProduct(id){return PRODUCTS.find(p=>p.id===id)}
function getVariant(id){return selected[id]||'retail'}
function renderTabs(){const cats=['Tous',...new Set(PRODUCTS.map(p=>p.category))];$('tabs').innerHTML=cats.map(c=>`<button type="button" class="tab ${category===c?'active':''}" data-cat="${clean(c)}">${clean(c)}</button>`).join('');$('tabs').querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.cat;renderTabs();renderProducts()}));}
function renderProducts(){
 const q=$('search').value.trim().toLocaleLowerCase('fr');
 const list=PRODUCTS.filter(p=>(category==='Tous'||p.category===category)&&(`${p.name} ${p.unit} ${p.category}`).toLocaleLowerCase('fr').includes(q));
 const sort=$('mode').value;
 if(sort==='asc'||sort==='desc')list.sort((a,b)=>(a.retail-b.retail)*(sort==='asc'?1:-1));
 $('result').textContent=`${list.length} conditionnement(s) disponible(s)`;
 $('grid').innerHTML=list.map(p=>{let v=getVariant(p.id);let vs=variants(p);if(!vs.some(x=>x.key===v))v='retail';let price=vs.find(x=>x.key===v).price;return `<article class="card"><div class="art"><span class="art-initial" aria-hidden="true">${categoryInitials[p.category]||'P'}</span><span class="art-caption" aria-hidden="true">${clean(p.category)}</span><img class="product-image" src="images/produits/${p.id}.jpg" alt="${clean(p.name)}" loading="lazy" decoding="async" onerror="this.hidden=true"></div><div class="cardbody"><span class="category">${clean(p.category)}</span><h3>${clean(p.name)}</h3><span class="unit">Conditionnement : ${clean(p.unit)}</span><label class="variant-label" for="v-${p.id}">Choisir le tarif</label><select id="v-${p.id}" data-variant="${p.id}">${vs.map(o=>`<option value="${o.key}" ${o.key===v?'selected':''}>${o.name} — ${format(o.price)}</option>`).join('')}</select><div class="price" id="price-${p.id}">${format(price)}</div><div class="wholesale-price">${p.wholesale!=null?'Gros / quantité : '+format(p.wholesale):'Prix de base : '+format(p.retail)}</div><div class="cardfoot"><div class="qty"><button type="button" data-minus="${p.id}" aria-label="Diminuer">−</button><span id="q-${p.id}">1</span><button type="button" data-plus="${p.id}" aria-label="Augmenter">+</button></div><button type="button" class="add" data-add="${p.id}">Ajouter</button></div></div></article>`}).join('');
 $('grid').querySelectorAll('[data-variant]').forEach(s=>s.onchange=()=>{selected[s.dataset.variant]=s.value;let p=getProduct(s.dataset.variant);$('price-'+p.id).textContent=format(s.value==='wholesale'?p.wholesale:p.retail)});
 $('grid').querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{let el=$('q-'+b.dataset.minus);el.textContent=Math.max(1,Number(el.textContent)-1)});
 $('grid').querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{let el=$('q-'+b.dataset.plus);el.textContent=Number(el.textContent)+1});
 $('grid').querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{let id=b.dataset.add,v=getVariant(id),key=id+'|'+v,qty=Number($('q-'+id).textContent);cart[key]=(cart[key]||0)+qty;save();renderCart();showQuickCartBar();toast('Ajouté au panier : '+getProduct(id).name)});
}
function showQuickCartBar(){
 const bar=$('quickCartBar');
 bar.hidden=false;
 requestAnimationFrame(()=>bar.classList.add('is-visible'));
 updateQuickCartBar();
}
function hideQuickCartBar(){
 const bar=$('quickCartBar');
 bar.classList.remove('is-visible');
 bar.hidden=true;
}
function updateQuickCartBar(){
 const list=entries(), count=list.reduce((sum,item)=>sum+item.qty,0), total=list.reduce((sum,item)=>sum+item.qty*item.price,0);
 $('quickCartCount').textContent=count+' '+(count===1?'article':'articles');
 $('quickCartTotal').textContent='Total : '+format(total);
 if(!count)hideQuickCartBar();
}
$('quickCartView').addEventListener('click',()=>{hideQuickCartBar();openCart()});
$('quickCartDismiss').addEventListener('click',hideQuickCartBar);
function save(){try{localStorage.setItem('repere_cart_v2',JSON.stringify(cart))}catch{}}
function entries(){return Object.entries(cart).filter(([key,n])=>n>0&&getProduct(key.split('|')[0])).map(([key,qty])=>{const [id,variant]=key.split('|');const p=getProduct(id);const price=variant==='wholesale'&&p.wholesale!=null?p.wholesale:p.retail;return {key,p,variant,price,qty};});}
let cartReturnFocus=null;
function openCart(){
 hideQuickCartBar();
 if($('cart').classList.contains('open'))return;
 cartReturnFocus=document.activeElement;
 $('cart').classList.add('open');$('shade').classList.add('open');
 document.body.classList.add('cart-open');
 $('cart').setAttribute('aria-hidden','false');$('openCart').setAttribute('aria-expanded','true');
 $('cart').scrollTop=0;
 $('closeCart').focus({preventScroll:true});
}
function closeCart(){
 if(!$('cart').classList.contains('open'))return;
 $('cart').classList.remove('open');$('shade').classList.remove('open');
 document.body.classList.remove('cart-open');
 $('cart').setAttribute('aria-hidden','true');$('openCart').setAttribute('aria-expanded','false');
 if(cartReturnFocus&&document.contains(cartReturnFocus))cartReturnFocus.focus({preventScroll:true});
}
function renderCart(){const items=entries();const count=items.reduce((s,x)=>s+x.qty,0);const total=items.reduce((s,x)=>s+x.qty*x.price,0);
 $('count').textContent=count;$('cartCount').textContent=count;
 updateQuickCartBar();
 $('items').innerHTML=items.map(x=>`<div class="cartrow"><div><b>${clean(x.p.name)}</b><small>${clean(x.p.unit)} · ${x.variant==='wholesale'?'GROS / QUANTITÉ':'NORMAL'} · ${format(x.price)} / unité</small><div class="qty"><button type="button" data-cminus="${x.key}">−</button><span>${x.qty}</span><button type="button" data-cplus="${x.key}">+</button></div><button type="button" class="remove" data-remove="${x.key}">Retirer</button></div><strong>${format(x.price*x.qty)}</strong></div>`).join('');
 $('empty').style.display=count?'none':'block';$('checkout').style.display=count?'grid':'none';$('total').textContent=format(total);
 $('shipping').textContent=total>=200000?'Seuil de 200 000 FCFA atteint : livraison gratuite envisageable même pour les zones éloignées, sous réserve de confirmation.':total>=100000?'Seuil de 100 000 FCFA atteint : livraison gratuite envisageable pour les courtes distances, sous réserve de confirmation.':'Livraison gratuite sous conditions : dès 100 000 FCFA à courte distance, 200 000 FCFA en zone éloignée.';
 $('items').querySelectorAll('[data-cminus]').forEach(b=>b.onclick=()=>{cart[b.dataset.cminus]--;if(cart[b.dataset.cminus]<=0)delete cart[b.dataset.cminus];save();renderCart()});
 $('items').querySelectorAll('[data-cplus]').forEach(b=>b.onclick=()=>{cart[b.dataset.cplus]++;save();renderCart()});
 $('items').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{delete cart[b.dataset.remove];save();renderCart()});
}
function whatsapp(message){window.open('https://wa.me/'+PHONE+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer')}
function fieldMessage(input, message) {
 const error=$(input.id+'Error');
 input.classList.toggle('is-invalid', Boolean(message));
 input.setAttribute('aria-invalid', String(Boolean(message)));
 if(error) error.textContent=message;
 return !message;
}
function validateOrderField(input){
 const value=input.value.trim();
 return fieldMessage(input, value?'':input.id==='client'?'Veuillez indiquer votre nom.':'Veuillez préciser votre quartier de livraison.');
}
['client','area'].forEach(id=>{
 const input=$(id);
 input.addEventListener('input',()=>{if(input.classList.contains('is-invalid'))validateOrderField(input)});
 input.addEventListener('blur',()=>{if(input.value.trim()||input.classList.contains('is-invalid'))validateOrderField(input)});
});
$('order').onclick=()=>{const items=entries();if(!items.length)return toast('Votre panier est vide.');
 const nameInput=$('client'), areaInput=$('area');
 const validName=validateOrderField(nameInput), validArea=validateOrderField(areaInput);
 if(!validName||!validArea){const first=!validName?nameInput:areaInput;first.scrollIntoView({block:'center',behavior:'smooth'});first.focus({preventScroll:true});return;}
 const name=nameInput.value.trim(),area=areaInput.value.trim();
 const total=items.reduce((sum,item)=>sum+item.price*item.qty,0);
 const lines=items.map((item,index)=>{
  const tarif=item.variant==='wholesale'?'Gros / quantité':'Détail';
  return `${index+1}. *${item.p.name}* (${item.p.unit})\n   ${tarif} · ${item.qty} × ${format(item.price)} = *${format(item.price*item.qty)}*`;
 });
 const message=[
  'Bonjour Repère des Cafetiers,',
  'Je souhaite passer la commande suivante :',
  '',
  '*INFORMATIONS CLIENT*',
  `Nom : ${name}`,
  `Quartier : ${area}, Yaoundé`,
  '',
  '*DÉTAIL DE LA COMMANDE*',
  ...lines,
  '',
  `*TOTAL ESTIMATIF : ${format(total)}*`,
  '',
  'Merci de me confirmer la commande et les prix indiqués. Je reste dans l’attente de votre retour concernant les modalités de livraison.'
 ].join('\n');
 whatsapp(message);
};
$('contactForm').onsubmit=e=>{e.preventDefault();const form=e.currentTarget;
 let firstInvalid=null;
 form.querySelectorAll('[required]').forEach(input=>{
   const msg=input.value.trim()?'':`Ce champ est obligatoire.`;
   const existing=input.parentElement.querySelector('.field-error');
   if(msg&&!firstInvalid)firstInvalid=input;
   input.classList.toggle('is-invalid',Boolean(msg));input.setAttribute('aria-invalid',String(Boolean(msg)));
   if(existing)existing.textContent=msg;
 });
 if(firstInvalid){firstInvalid.focus();return;}
 const f=new FormData(form);whatsapp(`Bonjour Repère des Cafetiers !\n\nNom : ${f.get('name')}\nTéléphone : ${f.get('phone')}\nQuartier : ${f.get('area')}\nObjet : ${f.get('subject')}\nMessage : ${f.get('message')}`)};
$('search').oninput=renderProducts;$('mode').onchange=renderProducts;$('openCart').onclick=openCart;$('closeCart').onclick=closeCart;$('shade').onclick=closeCart;$('area').oninput=renderCart;document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});
renderTabs();renderProducts();renderCart();

// Diaporama des photos fournies par Repère des Cafetiers.
const SHOWCASE_SLIDES=[
{src:"images/accueil-collage.webp",title:"Repère des Cafetiers",desc:"Au service des cafétérias à Yaoundé"},
 {src:'images/tenue-bleue.webp',title:'Notre équipe, notre identité',desc:'Une équipe engagée au service des cafétérias',alt:'Tenue bleue Repère des Cafetiers, avec les coordonnées de l’entreprise'},
 {src:'images/tenue-verte.webp',title:'Proches de nos clients',desc:'Produits alimentaires, œufs et livraison à Yaoundé',alt:'Tablier vert Repère des Cafetiers, présentant les services de livraison'},
 {src:'images/bracelet.webp',title:'La marque jusque dans les détails',desc:'Repère des Cafetiers · Yaoundé',alt:'Bracelet doré personnalisé Repère des Cafetiers'},
 {src:'images/montre.webp',title:'Une identité qui nous rassemble',desc:'Repère des Cafetiers · Yaoundé',alt:'Montre personnalisée au nom de Repère des Cafetiers'}
];
let showcaseIndex=0,showcaseTimer=null,showcaseSwapTimer=null;
const showcaseImage=$('showcaseImage');
const showcaseThumbs=$('showcaseThumbs');
showcaseThumbs.innerHTML=SHOWCASE_SLIDES.map((s,i)=>`<button type="button" class="showcase-thumb" data-slide="${i}" aria-label="Afficher la photo ${i+1}"><img src="${s.src}" alt="" loading="lazy"></button>`).join('');
function showShowcase(index){
 showcaseIndex=(index+SHOWCASE_SLIDES.length)%SHOWCASE_SLIDES.length;
 const s=SHOWCASE_SLIDES[showcaseIndex];
 showcaseImage.classList.add('is-changing');
 clearTimeout(showcaseSwapTimer);
 showcaseSwapTimer=setTimeout(()=>{showcaseImage.src=s.src;showcaseImage.alt=s.alt||s.title;showcaseImage.classList.remove('is-changing')},180);
 $('showcaseCounter').textContent=String(showcaseIndex+1).padStart(2,'0')+' / '+String(SHOWCASE_SLIDES.length).padStart(2,'0');
 $('showcaseTitle').textContent=s.title;$('showcaseDesc').textContent=s.desc;
 $('showcaseProgress').style.transform=`translateX(${showcaseIndex*100}%)`;
 showcaseThumbs.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===showcaseIndex);b.setAttribute('aria-pressed',String(i===showcaseIndex))});
}
function startShowcase(){clearInterval(showcaseTimer);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)showcaseTimer=setInterval(()=>showShowcase(showcaseIndex+1),5200)}
$('showcasePrev').onclick=()=>{showShowcase(showcaseIndex-1);startShowcase()};
$('showcaseNext').onclick=()=>{showShowcase(showcaseIndex+1);startShowcase()};
showcaseThumbs.querySelectorAll('button').forEach(b=>b.onclick=()=>{showShowcase(Number(b.dataset.slide));startShowcase()});
$('showcaseFrame').addEventListener('mouseenter',()=>clearInterval(showcaseTimer));
$('showcaseFrame').addEventListener('mouseleave',startShowcase);
document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(showcaseTimer):startShowcase());
const dots=$('heroDots');
dots.innerHTML=SHOWCASE_SLIDES.map((s,i)=>`<button type="button" data-dot="${i}" aria-label="Voir la diapositive ${i+1}"></button>`).join('');
dots.querySelectorAll('button').forEach(b=>b.onclick=()=>{showShowcase(Number(b.dataset.dot));startShowcase()});
const oldShowShowcase=showShowcase;
showShowcase=function(index){oldShowShowcase(index);dots.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===showcaseIndex))};
showShowcase(0);startShowcase();

// Validation locale des champs du formulaire de contact.
$('contactForm').querySelectorAll('[required]').forEach(input=>{
 const label=input.parentElement;
 if(!label.querySelector('.field-error')){
  const note=document.createElement('small');note.className='field-error';note.setAttribute('aria-live','polite');label.appendChild(note);
 }
 input.addEventListener('input',()=>{
  if(input.classList.contains('is-invalid')){
   const ok=Boolean(input.value.trim()); input.classList.toggle('is-invalid',!ok);
   input.setAttribute('aria-invalid',String(!ok));
   label.querySelector('.field-error').textContent=ok?'':'Ce champ est obligatoire.';
  }
 });
});
