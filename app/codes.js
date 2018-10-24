const codes = [
  {
    patternName: 'ollo',
    code: `
    `,
  },
  {
    patternName: 'oop',
    code: `
function Programmer(name, level,cofeeLover){
  this.name=name;
  this.level = level;
  this.coffeLover = cofeeLover;
}

Programmer.prototype.HelloWorld = function(){
  console.log("I am " + this.level + "programmer")
}

function JSProgrammer(name,level,cofeeLover,JSFramework){
  Programmer.call(this,name,level,cofeeLover);
  this.JSFramework = JSFramework;
}

JSProgrammer.prototype = Object.create(Programmer.prototype);

JSProgrammer.prototype.HelloWorld = function(){
  console.log("I love " + this.JSFramework);
} 

const Madmax = new JSProgrammer("Mladjan","pro",true,"React");
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
export default codes;
