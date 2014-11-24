var Box2D = {};
(function (F) {
    function K() {
    }
    F.inherit = function (y, w) {
        K.prototype = w.prototype;
        y.prototype = new K();
    };
    F.generateCallback = function (y, w) {
        return function () {
            w.apply(y, arguments);
        };
    };
}(Box2D));
var Vector = Array;
Box2D.Collision = {};
Box2D.Collision.Shapes = {};
Box2D.Common = {};
Box2D.Dynamics = {};
Box2D.Dynamics.Contacts = {};
(function () {
    function y() {
    }
    function w() {
    }
    function V() {
    }
    function M() {
        M.b2DynamicTreeBroadPhase.apply(this);
    }
    function L() {
    }
    function I() {
    }
    function W() {
        this.b2Manifold.apply(this);
    }
    function Y() {
        Y.b2ManifoldPoint.apply(this);
    }
    function Z() {
        Z.ClipVertex.apply(this);
    }
    function q() {
        this.b2PolygonShape.apply(this);
    }
    function n() {
    }
    function c() {
    }
    function v() {
        this.b2Body.apply(this, arguments);
    }
    function T() {
        this.b2ContactManager.apply(this);
    }
    function ba() {
    }
    function ca() {
    }
    function ea() {
        ea.b2World.apply(this);
        this.b2World.apply(this);
    }
    function fa() {
    }
    function ha() {
        this.b2ContactFactory.apply(this);
    }
    function Ja() {
    }
    function Oa() {
        Oa.b2PolygonContact.apply(this);
    }
    Box2D.Collision.b2Collision = y;
    Box2D.Collision.b2ContactID = w;
    Box2D.Collision.b2DynamicTree = V;
    Box2D.Collision.b2DynamicTreeBroadPhase = M;
    Box2D.Collision.b2DynamicTreeNode = L;
    Box2D.Collision.b2DynamicTreePair = I;
    Box2D.Collision.b2Manifold = W;
    Box2D.Collision.b2ManifoldPoint = Y;
    Box2D.Collision.ClipVertex = Z;
    Box2D.Collision.Shapes.b2PolygonShape = q;
    Box2D.Collision.Shapes.b2Shape = n;
    Box2D.Common.b2Settings = c;
    Box2D.Dynamics.b2Body = v;
    Box2D.Dynamics.b2ContactManager = T;
    Box2D.Dynamics.b2Fixture = ba;
    Box2D.Dynamics.b2FixtureDef = ca;
    Box2D.Dynamics.b2World = ea;
    Box2D.Dynamics.Contacts.b2Contact = fa;
    Box2D.Dynamics.Contacts.b2ContactFactory = ha;
    Box2D.Dynamics.Contacts.b2ContactRegister = Ja;
    Box2D.Dynamics.Contacts.b2PolygonContact = Oa;
}());
Box2D.postDefs = [];
(function () {
    var y = Box2D.Common.b2Settings, M = Box2D.Collision.b2Collision, L = Box2D.Collision.b2ContactID, u = Box2D.Collision.b2DynamicTree, D = Box2D.Collision.b2DynamicTreeBroadPhase, H = Box2D.Collision.b2DynamicTreeNode, O = Box2D.Collision.b2DynamicTreePair, E = Box2D.Collision.b2Manifold, R = Box2D.Collision.b2ManifoldPoint, a = Box2D.Collision.ClipVertex;
    M.MakeClipPointVector = function () {
        var b = new Vector();
        b[0] = new a();
        b[1] = new a();
        return b;
    };
    M.CollidePolygons = function (b) {
        {
            t = M.s_clipPoints2;
            for (m = r = 0; m < y.b2_maxManifoldPoints; ++m) {
                s = t[m];
                {
                    C = b.m_points[r];
                    C.m_id.Set(s.id);
                }
            }
        }
    };
    Box2D.postDefs.push(function () {
        Box2D.Collision.b2Collision.s_clipPoints2 = M.MakeClipPointVector();
    });
    L.prototype.Set = function (b) {
        this.key = b._key;
    };
    Object.defineProperty(L.prototype, 'key', {
        set: function () {
        }
    });
    u.prototype.CreateProxy = function (b, e) {
        var f = this.AllocateNode();
        f.userData = e;
        this.InsertLeaf(f);
        return f;
    };
    u.prototype.GetUserData = function (b) {
        return b.userData;
    };
    u.prototype.Query = function (b) {
        {
            var f = new Vector(), m = 0;
            for (f[m++] = this.m_root;;) {
                var r = f[--m];
                if (!b(r))
                    break;
            }
        }
    };
    u.prototype.AllocateNode = function () {
        return new H();
    };
    u.prototype.InsertLeaf = function (b) {
        this.m_root = b;
    };
    D.b2DynamicTreeBroadPhase = function () {
        this.m_tree = new u();
        this.m_moveBuffer = new Vector();
        this.m_pairBuffer = new Vector();
    };
    D.prototype.CreateProxy = function (b, e) {
        var f = this.m_tree.CreateProxy(b, e);
        this.BufferMove(f);
    };
    D.prototype.UpdatePairs = function (b) {
        var e = this;
        var f = e.m_pairCount = 0;
        for (f; f < e.m_moveBuffer.length; ++f) {
            m = e.m_moveBuffer[f];
            e.m_tree.Query(function (t) {
                e.m_pairBuffer[e.m_pairCount] = new O();
                var x = e.m_pairBuffer[e.m_pairCount];
                x.proxyA = m;
                x.proxyB = t;
                ++e.m_pairCount;
            });
        }
        for (f = 0; f < e.m_pairCount;) {
            r = e.m_pairBuffer[f];
            var s = e.m_tree.GetUserData(r.proxyA), v = e.m_tree.GetUserData(r.proxyB);
            b(s, v);
            for (++f;;)
                break;
        }
    };
    D.prototype.BufferMove = function (b) {
        this.m_moveBuffer[this.m_moveBuffer.length] = b;
    };
    E.prototype.b2Manifold = function () {
        this.m_points = new Vector();
        for (var b = 0; b < y.b2_maxManifoldPoints; b++)
            this.m_points[b] = new R();
    };
    R.b2ManifoldPoint = function () {
        this.m_id = new L();
    };
    a.ClipVertex = function () {
        this.id = new L();
    };
}());
(function () {
    var A = Box2D.Collision.Shapes.b2PolygonShape, U = Box2D.Collision.Shapes.b2Shape;
    Box2D.inherit(A, Box2D.Collision.Shapes.b2Shape);
    A.prototype.Copy = function () {
        var k = new A();
        return k;
    };
    A.prototype.b2PolygonShape = function () {
        this.m_type = U.e_polygonShape;
    };
    U.prototype.GetType = function () {
        return this.m_type;
    };
    Box2D.postDefs.push(function () {
        Box2D.Collision.Shapes.b2Shape.e_polygonShape = 1;
        Box2D.Collision.Shapes.b2Shape.e_shapeTypeCount = 3;
    });
}());
(function () {
    Box2D.postDefs.push(function () {
        Box2D.Common.b2Settings.b2_maxManifoldPoints = 2;
    });
}());
(function () {
    var B = Box2D.Collision.b2DynamicTreeBroadPhase, k = Box2D.Dynamics.b2Body, O = Box2D.Dynamics.b2ContactManager, S = Box2D.Dynamics.b2Fixture, h = Box2D.Dynamics.b2World, j = Box2D.Dynamics.Contacts.b2ContactFactory;
    k.prototype.CreateFixture = function (a) {
        var c = new S();
        c.Create(this, this.m_xf, a);
        c.CreateProxy(this.m_world.m_contactManager.m_broadPhase);
    };
    k.prototype.b2Body = function (a, c) {
        this.m_world = c;
    };
    O.prototype.b2ContactManager = function () {
        this.m_contactFactory = new j();
        this.m_broadPhase = new B();
    };
    O.prototype.AddPair = function (a, c) {
        var g = a, b = c;
        {
            m = this.m_contactFactory.Create(g, b);
            this.m_world.m_contactList = m;
        }
    };
    O.prototype.FindNewContacts = function () {
        this.m_broadPhase.UpdatePairs(Box2D.generateCallback(this, this.AddPair));
    };
    O.prototype.Collide = function () {
        for (var a = this.m_world.m_contactList; a;) {
            a.Update();
            a = a.GetNext();
        }
    };
    S.prototype.GetType = function () {
        return this.m_shape.GetType();
    };
    S.prototype.Create = function (a, c, g) {
        this.m_shape = g.shape.Copy();
    };
    S.prototype.CreateProxy = function (a) {
        a.CreateProxy(this.m_aabb, this);
    };
    h.b2World = function () {
        this.m_contactManager = new O();
    };
    h.prototype.b2World = function () {
        this.m_contactManager.m_world = this;
    };
    h.prototype.CreateBody = function (a) {
        a = new k(a, this);
        return a;
    };
    h.prototype.Step = function () {
        this.m_contactManager.Collide();
        this.Solve();
    };
    h.prototype.Solve = function () {
        this.m_contactManager.FindNewContacts();
    };
}());
(function () {
    var y = Box2D.Collision.Shapes.b2Shape, A = Box2D.Dynamics.Contacts.b2Contact, Q = Box2D.Dynamics.Contacts.b2ContactFactory, V = Box2D.Dynamics.Contacts.b2ContactRegister, z = Box2D.Dynamics.Contacts.b2PolygonContact, S = Box2D.Collision.b2Collision, Z = Box2D.Collision.b2Manifold;
    A.b2Contact = function () {
        this.m_manifold = new Z();
    };
    A.prototype.GetNext = function () {
    };
    A.prototype.Update = function () {
        this.Evaluate();
    };
    Q.prototype.b2ContactFactory = function () {
        this.InitializeRegisters();
    };
    Q.prototype.AddType = function (j, o, q, n) {
        this.m_registers[q][n].createFcn = j;
    };
    Q.prototype.InitializeRegisters = function () {
        this.m_registers = new Vector();
        for (var j = 0; j < y.e_shapeTypeCount; j++) {
            this.m_registers[j] = new Vector();
            for (var o = 0; o < y.e_shapeTypeCount; o++)
                this.m_registers[j][o] = new V();
        }
        this.AddType(z.Create, z.Destroy, y.e_polygonShape, y.e_polygonShape);
    };
    Q.prototype.Create = function (j, o) {
        var q = parseInt(j.GetType()), n = parseInt(o.GetType());
        q = this.m_registers[q][n];
        n = q.createFcn;
        {
            n = n();
            return n;
        }
    };
    Box2D.inherit(z, Box2D.Dynamics.Contacts.b2Contact);
    z.b2PolygonContact = function () {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this);
    };
    z.Create = function () {
        return new z();
    };
    z.prototype.Evaluate = function () {
        S.CollidePolygons(this.m_manifold);
    };
}());
for (i = 0; i < Box2D.postDefs.length; ++i)
    Box2D.postDefs[i]();
function MakeNewWorld() {
    var FixtureDef = Box2D.Dynamics.b2FixtureDef, World = Box2D.Dynamics.b2World, PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var world = new World();
    var shape = new PolygonShape();
    for (var i = 0; i < 1; ++i)
        for (var j = 0; j < 1; ++j) {
            var fd = new FixtureDef();
            fd.shape = shape;
            var body = world.CreateBody();
            body.CreateFixture(fd);
        }
    return world;
}
function runBox2D() {
    var world = MakeNewWorld();
    for (var i = 0; i < 2; i++)
        world.Step();
}
runBox2D();
