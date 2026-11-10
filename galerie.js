"use strict";
// Ajoutez galerie-06.jpg ou video-02.mp4 dans images/galerie : détection automatique.
(() => {
  const $=id=>document.getElementById(id);
  const grid=$('companyGalleryGrid'), viewport=$('companyGalleryViewport'), overlay=$('galleryViewer');
  if(!grid || !viewport || !overlay)return;
  const image=$('galleryViewerImage'), player=$('galleryViewerVideo');
  const label=$('galleryViewerLabel'),count=$('galleryCount');
  const pause=$('galleryPause'),prev=$('galleryPrev'),next=$('galleryNext'),close=$('galleryViewerClose');
  const left=$('galleryViewerPrev'),right=$('galleryViewerNext');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const titles={1:'Notre équipe',2:'Notre activité',3:'Notre identité',4:'Notre marque',5:'Repère des Cafetiers'};
  const images=Array.from({length:40},(_,i)=>({kind:'image',src:`images/galerie/galerie-${String(i+1).padStart(2,'0')}.jpg`,index:i+1,title:titles[i+1]||`Photo ${i+1}`}));
  const videos=Array.from({length:20},(_,i)=>({kind:'video',src:`images/galerie/video-${String(i+1).padStart(2,'0')}.mp4`,poster:`images/galerie/video-${String(i+1).padStart(2,'0')}.jpg`,index:i+1,title:`Vidéo ${i+1}`}));
  let slides=[],current=0,paused=reduce.matches,hovered=false,visible=false;
  let autoTimer=null,firstDelay=null,previousFocus=null,lockedY=0;
  function checkImage(p){return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(p);img.onerror=()=>resolve(null);img.src=p.src;});}
  function checkVideo(p){return new Promise(resolve=>{
    const video=document.createElement('video');video.preload='metadata';video.muted=true;
    const done=ok=>{video.removeAttribute('src');video.load();resolve(ok?p:null);};
    video.addEventListener('loadedmetadata',()=>done(true),{once:true});
    video.addEventListener('error',()=>done(false),{once:true});
    video.src=p.src;
  });}
  function tile(item,clone=false){
    const button=document.createElement('button');button.type='button';button.className='gallery-tile';
    button.setAttribute('aria-label',`Afficher ${item.kind==='video'?'la vidéo':'la photo'} : ${item.title}`);
    if(clone){button.tabIndex=-1;button.dataset.clone='true';}
    if(item.kind==='video'){
      button.classList.add('gallery-video-tile');
      const thumb=document.createElement('video');thumb.className='gallery-media-thumb';
      thumb.muted=true;thumb.playsInline=true;thumb.preload='metadata';
      thumb.poster=item.poster;thumb.src=item.src+'#t=0.2';
      thumb.setAttribute('aria-hidden','true');thumb.tabIndex=-1;
      const badge=document.createElement('span');badge.className='gallery-play';badge.textContent='▶';badge.setAttribute('aria-hidden','true');
      button.append(thumb,badge);
    } else {
      const img=document.createElement('img');img.src=item.src;img.alt='';img.loading='lazy';img.decoding='async';img.className='gallery-media-thumb';
      button.append(img);
    }
    const caption=document.createElement('span');caption.className='gallery-label';caption.textContent=item.title;
    button.append(caption);
    button.addEventListener('click',()=>open(item));return button;
  }
  function distance(){const first=grid.querySelector('.gallery-tile');return (first?.getBoundingClientRect().width||300)+(parseFloat(getComputedStyle(grid).gap)||0);}
  function cycleWidth(){const clone=grid.querySelector('[data-clone="true"]');return clone&&grid.firstElementChild?clone.offsetLeft-grid.firstElementChild.offsetLeft:0;}
  function advance(direction=1){
    if(slides.length<2||!overlay.hidden)return;
    const width=cycleWidth(),step=distance();
    if(direction>0&&width&&viewport.scrollLeft+step>=width-2)viewport.scrollLeft=Math.max(0,viewport.scrollLeft-width);
    if(direction<0&&width&&viewport.scrollLeft<step*.5)viewport.scrollLeft+=width;
    viewport.scrollBy({left:step*direction,behavior:reduce.matches?'instant':'smooth'});
  }
  function stopAuto(){clearInterval(autoTimer);clearTimeout(firstDelay);autoTimer=null;firstDelay=null;}
  function canAuto(){return slides.length>1&&visible&&!paused&&!hovered&&overlay.hidden&&!document.hidden;}
  function scheduleAuto(){stopAuto();if(!canAuto())return;firstDelay=setTimeout(()=>{if(!canAuto())return;advance(1);autoTimer=setInterval(()=>{if(canAuto())advance(1);},4800);},4200);}
  function updatePause(){pause.textContent=paused?'Reprendre':'Pause';pause.setAttribute('aria-pressed',String(paused));}
  function stopPlayback(){player.pause();player.removeAttribute('src');player.load();player.hidden=true;image.hidden=false;}
  function showSlide(index){
    if(!slides.length)return;
    stopPlayback();current=(index+slides.length)%slides.length;
    const item=slides[current];
    if(item.kind==='video'){
      image.hidden=true;image.removeAttribute('src');player.hidden=false;
      player.src=item.src;player.load(); // Playback only after the visitor presses Play.
    }else{
      image.hidden=false;image.src=item.src;image.alt=item.title;
    }
    label.textContent=`${current+1} / ${slides.length} — ${item.title}`;
  }
  function open(item){
    if(!overlay.hidden)return;
    previousFocus=document.activeElement;
    lockedY=window.scrollY;
    // Use a fixed backdrop and lock body scroll, restoring the original position on exit.
    document.body.style.position='fixed';document.body.style.top=`-${lockedY}px`;
    document.body.style.left='0';document.body.style.right='0';document.body.style.width='100%';
    overlay.hidden=false;showSlide(slides.findIndex(x=>x.src===item.src));stopAuto();
    close.focus({preventScroll:true});
  }
  function closeViewer(){
    if(overlay.hidden)return;stopPlayback();overlay.hidden=true;image.removeAttribute('src');
    for(const key of ['position','top','left','right','width'])document.body.style[key]='';
    window.scrollTo({top:lockedY,left:0,behavior:'instant'});
    if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});scheduleAuto();
  }
  close.addEventListener('click',closeViewer);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeViewer();});
  left.addEventListener('click',()=>showSlide(current-1));right.addEventListener('click',()=>showSlide(current+1));
  document.addEventListener('keydown',e=>{
    if(overlay.hidden)return;
    if(e.key==='Escape'){e.preventDefault();closeViewer();}
    if(e.key==='ArrowLeft'&&e.target!==player){e.preventDefault();showSlide(current-1);}
    if(e.key==='ArrowRight'&&e.target!==player){e.preventDefault();showSlide(current+1);}
    if(e.key==='Tab'){
      const controls=[close,left,right,...(player.hidden?[]:[player])];
      if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls.at(-1).focus();}
      else if(!e.shiftKey&&document.activeElement===controls.at(-1)){e.preventDefault();controls[0].focus();}
    }
  });
  prev.addEventListener('click',()=>{advance(-1);scheduleAuto();});
  next.addEventListener('click',()=>{advance(1);scheduleAuto();});
  pause.addEventListener('click',()=>{paused=!paused;updatePause();scheduleAuto();});
  viewport.addEventListener('mouseenter',()=>{hovered=true;stopAuto();});
  viewport.addEventListener('mouseleave',()=>{hovered=false;scheduleAuto();});
  viewport.addEventListener('focusin',()=>{hovered=true;stopAuto();});
  viewport.addEventListener('focusout',e=>{if(!viewport.contains(e.relatedTarget)){hovered=false;scheduleAuto();}});
  viewport.addEventListener('pointerdown',stopAuto,{passive:true});viewport.addEventListener('pointerup',scheduleAuto,{passive:true});
  document.addEventListener('visibilitychange',scheduleAuto);
  reduce.addEventListener?.('change',e=>{if(e.matches)paused=true;updatePause();scheduleAuto();});
  if('IntersectionObserver'in window){new IntersectionObserver(entries=>{visible=Boolean(entries[0]?.isIntersecting);scheduleAuto();},{threshold:.12}).observe(viewport);}else visible=true;
  Promise.all([...images.map(checkImage),...videos.map(checkVideo)]).then(results=>{
    const found=results.filter(Boolean),pics=found.filter(p=>p.kind==='image'),clips=found.filter(p=>p.kind==='video');
    slides=[...pics.slice(0,5),...clips,...pics.slice(5)];
    count.textContent=`${pics.length} photo${pics.length>1?'s':''}${clips.length?` · ${clips.length} vidéo${clips.length>1?'s':''}`:''}`;
    if(!slides.length){grid.innerHTML='<p class="gallery-empty">Ajoutez vos photos ou vidéos dans images/galerie.</p>';prev.disabled=next.disabled=pause.disabled=true;return;}
    slides.forEach(item=>grid.appendChild(tile(item)));
    if(slides.length>1)slides.forEach(item=>grid.appendChild(tile(item,true)));
    else prev.disabled=next.disabled=pause.disabled=true;
    updatePause();scheduleAuto();
  });
})();
