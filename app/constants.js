export const codes = [
  {
    patternName: 'ollo',
    code: '',
  },
  {
    patternName: 'oop',
    code: `
  function Programmer(name, level,cofeeLover,frameworks){
      this.name=name;
      this.level = level;
      this.coffeLover = cofeeLover;
      this.frameworks=frameworks;
  }
  
  Programmer.prototype.HelloWorld = function(){
      console.log("I am " + this.level + "programmer")
  }
  
  function JSProgrammer(name,level,cofeeLover,JSFramework,frameworks){
      Programmer.call(this,name,level,cofeeLover,frameworks);
      this.JSFramework = JSFramework;
  }
  
  JSProgrammer.prototype = Object.create(Programmer.prototype);
  
  JSProgrammer.prototype.HelloWorld = function(){
      console.log("I love " + this.JSFramework);
  } 
  
  const Madmax = new JSProgrammer("Mladjan","pro",true,"React",['react','vue','angular']);
  Madmax.HelloWorld();   
  `,
  },
  {
    patternName: 'oop 1',
    code: 'let oop1 = 100',
  },
  {
    patternName: 'oop 2',
    code: 'let oop2 = 100',
  },
];

export const JS_INTERNALS_TO_VISUALISE = ['Function', 'Object', 'Array', 'Number', 'String', 'Promise', 'Math'];

export const BY_VALUE = ['string', 'number', 'symbol', 'undefined', 'boolean'];
