function el(){
  const store={style:{},dataset:{},value:'',classObj:{add(){},remove(){},toggle(){},contains(){return false}}};
  const f=new Proxy(function(){}, {
    get(t,k){
      if(k==='id')return 's-home';
      if(k==='classList')return store.classObj;
      if(k==='style')return store.style;
      if(k==='dataset')return store.dataset;
      if(k==='value')return store.value;
      if(k==='children')return [el(),el(),el()];
      if(k==='length')return 0;
      if(k===Symbol.toPrimitive)return ()=> '';
      if(typeof k==='symbol')return undefined;
      if(k in store)return store[k];
      store[k]=(...a)=>el();
      return store[k];
    },
    set(t,k,v){store[k]=v;return true;},
    apply(){return el();}
  });
  return f;
}
var _els={},_qs={};
var document={
  querySelector:(s)=>(_qs[s]=_qs[s]||el()),
  querySelectorAll:()=>[],
  getElementById:(id)=>(_els[id]=_els[id]||el()),
  createElement:()=>el(),
  body:el()
};
var localStorage={_s:{},getItem(k){return this._s[k]||null},setItem(k,v){this._s[k]=String(v)},removeItem(k){delete this._s[k]}};
var VIBES=[]; // espion haptique (Lot 8)
var navigator={vibrate:function(m){VIBES.push(m||0);return true;}};
var setTimeout=(fn,ms)=>0;
var clearTimeout=(t)=>{};

