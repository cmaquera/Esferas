//Definicion de variables globales
var mundo,
    gravedad,
    muros = [],
    esferas = [],
    canvasDebug = document.getElementById('canvas-debug');


//Definicion de la libreria de Box2d y elementos de este a usar;
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2World = Box2D.Dynamics.b2World,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

//Creacion del mundo
gravedad = new b2Vec2(0,20);
mundo =  new b2World(gravedad, true);

//tamaño delcanvas
ancho = canvasDebug.width;
alto = canvasDebug.height;

//generación de pared
var DimencionPared = [
    //PosicionX     PosicionY   Ancho       Alto
    //{x: ancho/2,    y: 0,       w: ancho/2, h: 1},      //Superior
    {x: ancho/2,    y: alto,    w: ancho/2, h: 1},      //Inferior
    {x: 0,          y: alto/2,  w: 1,       h: alto},   //Izquierda
    {x: ancho,      y: alto/2,  w: 1,       h: alto},   //Derecha
    {x: 200,        y: 300,     w: 50,      h: 10},      //Muro en la parte inferior
    {x: 400,        y: 300,     w: 50,      h: 10},
    {x: 300,        y: 200,     w: 50,      h: 10}
];


for(i = 0; i < DimencionPared.length; i++){
    var DefPared = new b2BodyDef; //Creamos un cuerpo o elemnto nuevo
    DefPared.type = b2Body.b2_staticBody; //Establecemos que sea estatico
    DefPared.position.Set(DimencionPared[i].x/30, DimencionPared[i].y/30); //Etablecemos su posicion (1m = 30px)

    var fixture = new b2FixtureDef; //Creamos una cnfiguracion de cuerpo
    fixture.density = 10;           //Determina el peso del cuerpo
    fixture.friction = 0.5;         //Determina el coeficioente de friccion con otro elementos
    fixture.restitution = 0.9;      //Capacidad de rebote(Tambien determina los elementos que rebotna en el)

    fixture.shape = new b2PolygonShape //Establecemos que sera un poligono
    fixture.shape.SetAsBox(DimencionPared[i].w/30, DimencionPared[i].h/30); //Establemcemo sus dimeciones (1m = 30px)

    var muro = mundo.CreateBody(DefPared);  //Añadimo el muro al mundo
    muro.CreateFixture(fixture);            //Establecemos la configuracion del muro en el mundo

    //Añdimos el muro al array de muros
    muros.push(muro);
}

//Dibujando el canvas
var dibujarDebug = new b2DebugDraw(); //Objeto prar la visuzlizacion de la depuración
dibujarDebug.SetSprite(canvasDebug.getContext("2d")); //Establecer el contexto del la visualizacion 
dibujarDebug.SetDrawScale(30); //Escala de visualizacion 
dibujarDebug.SetFillAlpha(0.3); //Transparencia de los ementos dentro del canvas
dibujarDebug.SetLineThickness(1.0);
dibujarDebug.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

mundo.SetDebugDraw(dibujarDebug);

var FPS = 69; //Establecer los frames por segundo

setInterval(function(){
    mundo.Step(1 / FPS, 10,10); //Avanzar la escena
    mundo.DrawDebugData();
    mundo.ClearForces();
}, 1000/FPS);

canvasDebug.addEventListener('click', function(evento){
    var rect = canvasDebug.getBoundingClientRect();
    var mousex = evento.clientX - rect.left,
        mousey = evento.clientY - rect.top;
    var DefEsfera =  new b2BodyDef;
    DefEsfera.type =  b2Body.b2_dynamicBody;
    DefEsfera.position.Set(mousex/30, mousey/30);

    var fixture = new b2FixtureDef;
    fixture.density = 10;
    fixture.friction = 0.5;
    fixture.restitution = 0.8;
    fixture.shape = new b2CircleShape(10/30); //establecer el radio de la esfera

    var esfera =  mundo.CreateBody(DefEsfera);
    esfera.CreateFixture(fixture);

    //Generamos una velocidad aleatoria
    var factorVelocidad = 10,
        aleatorioVelocidad = Math.round(Math.random()*factorVelocidad*2) - factorVelocidad;

    //Establecemo la velocidad de la esfera
    var velocidad = new b2Vec2(aleatorioVelocidad, 0)
    esfera.SetLinearVelocity(velocidad,0);
    esferas.push(esfera);

});