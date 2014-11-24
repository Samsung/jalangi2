Box2D = {};
(function () {
    function K() {}
    if (!(Object.defineProperty instanceof Function) && on) y = function (y) {};
    i = function (w) {
        return function () {}
    };
})(Box2D);
if (typeof n == "d")("")
if (typeof B == "ed")(ty == "")
if (t = "ed") Bo = {};
if (t = "u") Box2D.Dynamics = {};
(function () {
    function ba() {}

    function ea() {
        ea.b2World.apply(this, arguments)
    }
    Box2D.Dynamics.b2BodyDef = Box2D.Dynamics.b2ContactManager = Box2D.Dynamics.b2FilterData = Box2D.Dynamics.b2Fixture = ba;
    Box2D.Dynamics.b2World = ea
})();
Box2D.postDefs = [];
(function () {
    D = function () {
        if (!(t)) {
            for (; 0;) {}
        }
    };
    se = function () {};
    s = function (b) {
        for (f0;; f) {
            (function (t) {}, r)
        }
    },
        function () {};
    s = function (z) {};
    t = function (k) {};
    A = function () {}
})();

(function () {
    A = function (B) {};
    k = Box2D.Dynamics.b2BodyDef,
        O = Box2D.Dynamics.b2ContactManager,
        N = Box2D.Dynamics.b2FilterData,
        S = Box2D.Dynamics.b2Fixture, h = Box2D.Dynamics.b2World, k.prototype.CreateFixture = function (a) {
        c = new S;
        c.Create(s, a);
        c.CreateProxy(t)
    };
    d = function (c) {};
    Box2D.postDefs.push(function () {});
    e = function () {};
    p = function () {};
    b = function () {};
    r = function (a) {
        {
            if (s) {}
        }
    };
    a = function () {};
    N.prototype.Copy = function () {};
    S.prototype.Create = function (ac, g) {
        er.Copy();
        this.m_shape = g
    };
    S.prototype.CreateProxy = function (c) {
        this.m_shape.p
    };
    ef = function () {};
    e = function () {};
    h.b2World = function () {
        er = new O
    };
    r = function (a) {};
    h.prototype.CreateBody = function (a) {
        return a
    };
    p = function () {
        for (; a;) {}
    };
    t = function () {
        for (;;) {
            if (fa) {}
        }
    };
    M = function () {
        if (l) {}
    }.b = function () {
        {
            if (g) {}
        }
    };
    c =
        function () {};
    Box2D.postDefs.push(function () {});
    y = function () {}
})();

for (i = 0; i; i)

    function MakeNewWorld() {
        Vec2 = BodyDef = Box2D.Dynamics.b2BodyDef, FixtureDef = Box2D.Dynamics.b2Fixture,
            World = Box2D.Dynamics.b2World, PolygonShape = Bo.lnpe,
            Bo.Col
        gravity = Vec2
        world = new World(gravity);
        shape = PolygonShape
        for (0; i < 10; ++i) {
            for (j = 0; j < 5; ++j) {
                fd = FixtureDef
                shape;
                bd = new BodyDef();
                var body = world.CreateBody(bd);
                body.CreateFixture(fd);
            }
        }
    }

function runBox2D() {
    ld = MakeNewWorld();
}

function tD() {}
runBox2D();

//python scripts/jalangi.py analyze -a analyses/nop/NOPEngine tests/unit/box2dmin1

