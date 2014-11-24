// Portions copyright 2012 Google, Inc
/*
 * Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
 *
 * This software is provided 'as-is', without any express or implied
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */
var Box2D = {};
(function (F, G) {
    function K() {}
    if (!(Object.defineProperty instanceof Function) && Object.prototype.__defineGetter__ instanceof Function && Object.prototype.__defineSetter__ instanceof Function) Object.defineProperty = function (y, w, A) {
        A.get instanceof Function && y.__defineGetter__(w, A.get);
        A.set instanceof Function && y.__defineSetter__(w, A.set)
    };
    F.inherit = function (y, w) {
        K.prototype = w.prototype;
        y.prototype = new K;
        y.prototype.constructor = y
    };
    F.generateCallback = function (y, w) {
        return function () {
            w.apply(y, arguments)
        }
    };
    F.NVector = function (y) {
        if (y === G) y = 0;
        for (var w = Array(y || 0), A = 0; A < y; ++A) w[A] = 0;
        return w
    };
    F.is = function (y, w) {
        if (y === null) return false;
        if (w instanceof Function && y instanceof w) return true;
        if (y.constructor.__implements != G && y.constructor.__implements[w]) return true;
        return false
    };
    F.parseUInt = function (y) {
        return Math.abs(parseInt(y))
    }
})(Box2D);
var Vector = Array,
    Vector_a2j_Number = Box2D.NVector;
if (typeof Box2D === "undefined") Box2D = {};
if (typeof Box2D.Collision === "undefined") Box2D.Collision = {};
if (typeof Box2D.Collision.Shapes === "undefined") Box2D.Collision.Shapes = {};
if (typeof Box2D.Common === "undefined") Box2D.Common = {};
if (typeof Box2D.Common.Math === "undefined") Box2D.Common.Math = {};
if (typeof Box2D.Dynamics === "undefined") Box2D.Dynamics = {};
if (typeof Box2D.Dynamics.Contacts === "undefined") Box2D.Dynamics.Contacts = {};
if (typeof Box2D.Dynamics.Controllers === "undefined") Box2D.Dynamics.Controllers = {};
if (typeof Box2D.Dynamics.Joints === "undefined") Box2D.Dynamics.Joints = {};
(function () {
    function F() {
        F.b2AABB.apply(this, arguments)
    }

    function G() {
        G.b2Bound.apply(this, arguments)
    }

    function K() {
        K.b2BoundValues.apply(this, arguments);
        this.constructor === K && this.b2BoundValues.apply(this, arguments)
    }

    function y() {
        y.b2Collision.apply(this, arguments)
    }

    function w() {
        w.b2ContactID.apply(this, arguments);
        this.constructor === w && this.b2ContactID.apply(this, arguments)
    }

    function A() {
        A.b2ContactPoint.apply(this, arguments)
    }

    function U() {
        U.b2Distance.apply(this, arguments)
    }

    function p() {
        p.b2DistanceInput.apply(this,
            arguments)
    }

    function B() {
        B.b2DistanceOutput.apply(this, arguments)
    }

    function Q() {
        Q.b2DistanceProxy.apply(this, arguments)
    }

    function V() {
        V.b2DynamicTree.apply(this, arguments);
        this.constructor === V && this.b2DynamicTree.apply(this, arguments)
    }

    function M() {
        M.b2DynamicTreeBroadPhase.apply(this, arguments)
    }

    function L() {
        L.b2DynamicTreeNode.apply(this, arguments)
    }

    function I() {
        I.b2DynamicTreePair.apply(this, arguments)
    }

    function W() {
        W.b2Manifold.apply(this, arguments);
        this.constructor === W && this.b2Manifold.apply(this, arguments)
    }

    function Y() {
        Y.b2ManifoldPoint.apply(this, arguments);
        this.constructor === Y && this.b2ManifoldPoint.apply(this, arguments)
    }
    function u() {
        u.b2RayCastOutput.apply(this, arguments)
    }

    function D() {
        D.b2Segment.apply(this, arguments)
    }

    function H() {
        H.b2SeparationFunction.apply(this, arguments)
    }

    function O() {
        O.b2Simplex.apply(this, arguments);
        this.constructor ===
            O && this.b2Simplex.apply(this, arguments)
    }

    function E() {
        E.b2SimplexCache.apply(this, arguments)
    }

    function R() {
        R.b2SimplexVertex.apply(this, arguments)
    }

    function N() {
        N.b2TimeOfImpact.apply(this, arguments)
    }

    function S() {
        S.b2TOIInput.apply(this, arguments)
    }

    function aa() {
        aa.b2WorldManifold.apply(this, arguments);
        this.constructor === aa && this.b2WorldManifold.apply(this, arguments)
    }

    function Z() {
        Z.ClipVertex.apply(this, arguments)
    }

    function d() {
        d.Features.apply(this, arguments)
    }

    function h() {
        h.b2CircleShape.apply(this, arguments);
        this.constructor === h && this.b2CircleShape.apply(this, arguments)
    }

    function l() {
        l.b2EdgeChainDef.apply(this, arguments);
        this.constructor === l && this.b2EdgeChainDef.apply(this, arguments)
    }

    function j() {
        j.b2EdgeShape.apply(this, arguments);
        this.constructor === j && this.b2EdgeShape.apply(this, arguments)
    }

    function o() {
        o.b2MassData.apply(this, arguments)
    }

    function q() {
        q.b2PolygonShape.apply(this, arguments);
        this.constructor === q && this.b2PolygonShape.apply(this, arguments)
    }

    function n() {
        n.b2Shape.apply(this, arguments);
        this.constructor ===
            n && this.b2Shape.apply(this, arguments)
    }

    function a() {
        a.b2Color.apply(this, arguments);
        this.constructor === a && this.b2Color.apply(this, arguments)
    }

    function c() {
        c.b2Settings.apply(this, arguments)
    }

    function g() {
        g.b2Mat22.apply(this, arguments);
        this.constructor === g && this.b2Mat22.apply(this, arguments)
    }

    function b() {
        b.b2Mat33.apply(this, arguments);
        this.constructor === b && this.b2Mat33.apply(this, arguments)
    }

    function e() {
        e.b2Math.apply(this, arguments)
    }

    function f() {
        f.b2Sweep.apply(this, arguments)
    }

    function m() {
        m.b2Transform.apply(this,
            arguments);
        this.constructor === m && this.b2Transform.apply(this, arguments)
    }

    function r() {
        r.b2Vec2.apply(this, arguments);
        this.constructor === r && this.b2Vec2.apply(this, arguments)
    }

    function s() {
        s.b2Vec3.apply(this, arguments);
        this.constructor === s && this.b2Vec3.apply(this, arguments)
    }

    function v() {
        v.b2Body.apply(this, arguments);
        this.constructor === v && this.b2Body.apply(this, arguments)
    }

    function t() {
        t.b2BodyDef.apply(this, arguments);
        this.constructor === t && this.b2BodyDef.apply(this, arguments)
    }

    function x() {
        x.b2ContactFilter.apply(this,
            arguments)
    }

    function C() {
        C.b2ContactImpulse.apply(this, arguments)
    }

    function J() {
        J.b2ContactListener.apply(this, arguments)
    }

    function T() {
        T.b2ContactManager.apply(this, arguments);
        this.constructor === T && this.b2ContactManager.apply(this, arguments)
    }

    function P() {
        P.b2DebugDraw.apply(this, arguments);
        this.constructor === P && this.b2DebugDraw.apply(this, arguments)
    }

    function X() {
        X.b2DestructionListener.apply(this, arguments)
    }

    function $() {
        $.b2FilterData.apply(this, arguments)
    }

    function ba() {
        ba.b2Fixture.apply(this, arguments);
        this.constructor === ba && this.b2Fixture.apply(this, arguments)
    }

    function ca() {
        ca.b2FixtureDef.apply(this, arguments);
        this.constructor === ca && this.b2FixtureDef.apply(this, arguments)
    }

    function da() {
        da.b2Island.apply(this, arguments);
        this.constructor === da && this.b2Island.apply(this, arguments)
    }

    function Fa() {
        Fa.b2TimeStep.apply(this, arguments)
    }

    function ea() {
        ea.b2World.apply(this, arguments);
        this.constructor === ea && this.b2World.apply(this, arguments)
    }

    function Ga() {
        Ga.b2CircleContact.apply(this, arguments)
    }

    function fa() {
        fa.b2Contact.apply(this,
            arguments);
        this.constructor === fa && this.b2Contact.apply(this, arguments)
    }

    function ga() {
        ga.b2ContactConstraint.apply(this, arguments);
        this.constructor === ga && this.b2ContactConstraint.apply(this, arguments)
    }

    function Ha() {
        Ha.b2ContactConstraintPoint.apply(this, arguments)
    }

    function Ia() {
        Ia.b2ContactEdge.apply(this, arguments)
    }

    function ha() {
        ha.b2ContactFactory.apply(this, arguments);
        this.constructor === ha && this.b2ContactFactory.apply(this, arguments)
    }

    function Ja() {
        Ja.b2ContactRegister.apply(this, arguments)
    }

    function Ka() {
        Ka.b2ContactResult.apply(this,
            arguments)
    }

    function ia() {
        ia.b2ContactSolver.apply(this, arguments);
        this.constructor === ia && this.b2ContactSolver.apply(this, arguments)
    }

    function La() {
        La.b2EdgeAndCircleContact.apply(this, arguments)
    }

    function ja() {
        ja.b2NullContact.apply(this, arguments);
        this.constructor === ja && this.b2NullContact.apply(this, arguments)
    }

    function Ma() {
        Ma.b2PolyAndCircleContact.apply(this, arguments)
    }

    function Na() {
        Na.b2PolyAndEdgeContact.apply(this, arguments)
    }

    function Oa() {
        Oa.b2PolygonContact.apply(this, arguments)
    }

    function ka() {
        ka.b2PositionSolverManifold.apply(this,
            arguments);
        this.constructor === ka && this.b2PositionSolverManifold.apply(this, arguments)
    }

    function Pa() {
    }

    function Ua() {
        Ua.b2GravityController.apply(this, arguments)
    }

    function Va() {
        Va.b2TensorDampingController.apply(this, arguments)
    }

    function la() {
        la.b2DistanceJoint.apply(this, arguments);
        this.constructor === la && this.b2DistanceJoint.apply(this, arguments)
        pa.b2GearJoint.apply(this,
            arguments);
        this.constructor === pa && this.b2GearJoint.apply(this, arguments)
    }

    function Wa() {
        Wa.b2Jacobian.apply(this, arguments)
    }

    function ra() {
        ra.b2Joint.apply(this, arguments);
        this.constructor === ra && this.b2Joint.apply(this, arguments)
    }

    function sa() {
        sa.b2JointDef.apply(this, arguments);
        this.constructor === sa && this.b2JointDef.apply(this, arguments)
    }

    function Xa() {
        Xa.b2JointEdge.apply(this, arguments)
    }

    function ta() {
        xa.b2PrismaticJoint.apply(this,
            arguments);
        this.constructor === xa && this.b2PrismaticJoint.apply(this, arguments)
    }

    function ya() {
        ya.b2PrismaticJointDef.apply(this, arguments);
        this.constructor === ya && this.b2PrismaticJointDef.apply(this, arguments)
    }

    function za() {
        za.b2PulleyJoint.apply(this, arguments);
        this.constructor === za && this.b2PulleyJoint.apply(this, arguments)
    }

    function Aa() {
        Aa.b2PulleyJointDef.apply(this, arguments);
        this.constructor === Aa && this.b2PulleyJointDef.apply(this, arguments)
    }

    function Ba() {
        Ba.b2RevoluteJoint.apply(this, arguments);
        this.constructor === Ba && this.b2RevoluteJoint.apply(this, arguments)
    }

    function Ca() {
        Ca.b2RevoluteJointDef.apply(this, arguments);
        this.constructor === Ca && this.b2RevoluteJointDef.apply(this, arguments)
    }

    function Da() {
        Da.b2WeldJoint.apply(this, arguments);
        this.constructor === Da && this.b2WeldJoint.apply(this, arguments)
    }

    function Ea() {
        Ea.b2WeldJointDef.apply(this, arguments);
        this.constructor === Ea && this.b2WeldJointDef.apply(this, arguments)
    }
    Box2D.Collision.IBroadPhase = "Box2D.Collision.IBroadPhase";
    Box2D.Collision.b2AABB =
        F;
    Box2D.Collision.b2Bound = G;
    Box2D.Collision.b2BoundValues = K;
    Box2D.Collision.b2Collision = y;
    Box2D.Collision.b2ContactID = w;
    Box2D.Collision.b2ContactPoint = A;
    Box2D.Collision.b2Distance = U;
    Box2D.Collision.b2DistanceInput = p;
    Box2D.Collision.b2DistanceOutput = B;
    Box2D.Collision.b2DistanceProxy = Q;
    Box2D.Collision.b2DynamicTree = V;
    Box2D.Collision.b2DynamicTreeBroadPhase = M;
    Box2D.Collision.b2DynamicTreeNode = L;
    Box2D.Collision.b2DynamicTreePair = I;
    Box2D.Collision.b2Manifold = W;
    Box2D.Collision.b2ManifoldPoint = Y;
    Box2D.Collision.b2Point =
    Box2D.Collision.b2SeparationFunction = H;
    Box2D.Collision.b2Simplex = O;
    Box2D.Collision.b2SimplexCache = E;
    Box2D.Collision.b2SimplexVertex = R;
    Box2D.Collision.b2TimeOfImpact = N;
    Box2D.Collision.b2TOIInput = S;
    Box2D.Collision.b2WorldManifold = aa;
    Box2D.Collision.ClipVertex = Z;
    Box2D.Collision.Features = d;
    Box2D.Collision.Shapes.b2CircleShape = h;
    Box2D.Collision.Shapes.b2EdgeChainDef = l;
    Box2D.Collision.Shapes.b2EdgeShape = j;
    Box2D.Collision.Shapes.b2MassData =
        o;
    Box2D.Collision.Shapes.b2PolygonShape = q;
    Box2D.Collision.Shapes.b2Shape = n;
    Box2D.Common.b2internal = "Box2D.Common.b2internal";
    Box2D.Common.b2Color = a;
    Box2D.Common.b2Settings = c;
    Box2D.Common.Math.b2Mat22 = g;
    Box2D.Common.Math.b2Mat33 = b;
    Box2D.Common.Math.b2Math = e;
    Box2D.Common.Math.b2Sweep = f;
    Box2D.Common.Math.b2Transform = m;
    Box2D.Common.Math.b2Vec2 = r;
    Box2D.Common.Math.b2Vec3 = s;
    Box2D.Dynamics.b2Body = v;
    Box2D.Dynamics.b2BodyDef = t;
    Box2D.Dynamics.b2ContactFilter = x;
    Box2D.Dynamics.b2ContactImpulse = C;
    Box2D.Dynamics.b2ContactListener =
        J;
    Box2D.Dynamics.b2ContactManager = T;
    Box2D.Dynamics.b2DebugDraw = P;
    Box2D.Dynamics.b2DestructionListener = X;
    Box2D.Dynamics.b2FilterData = $;
    Box2D.Dynamics.b2Fixture = ba;
    Box2D.Dynamics.b2FixtureDef = ca;
    Box2D.Dynamics.b2Island = da;
    Box2D.Dynamics.b2TimeStep = Fa;
    Box2D.Dynamics.b2World = ea;
    Box2D.Dynamics.Contacts.b2CircleContact = Ga;
    Box2D.Dynamics.Contacts.b2Contact = fa;
    Box2D.Dynamics.Contacts.b2ContactConstraint = ga;
    Box2D.Dynamics.Contacts.b2ContactConstraintPoint = Ha;
    Box2D.Dynamics.Contacts.b2ContactEdge = Ia;
    Box2D.Dynamics.Contacts.b2ContactFactory =
        ha;
    Box2D.Dynamics.Contacts.b2ContactRegister = Ja;
    Box2D.Dynamics.Contacts.b2ContactResult = Ka;
    Box2D.Dynamics.Contacts.b2ContactSolver = ia;
    Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = La;
    Box2D.Dynamics.Contacts.b2NullContact = ja;
    Box2D.Dynamics.Contacts.b2PolyAndCircleContact = Ma;
    Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = Na;
    Box2D.Dynamics.Contacts.b2PolygonContact = Oa;
    Box2D.Dynamics.Contacts.b2PositionSolverManifold = ka;
    Box2D.Dynamics.Controllers.b2BuoyancyController = Pa;
    Box2D.Dynamics.Controllers.b2GravityController = Ua;
    Box2D.Dynamics.Controllers.b2TensorDampingController = Va;
    Box2D.Dynamics.Joints.b2DistanceJoint = la;
    Box2D.Dynamics.Joints.b2Jacobian = Wa;
    Box2D.Dynamics.Joints.b2Joint = ra;
    Box2D.Dynamics.Joints.b2JointDef = sa;
    Box2D.Dynamics.Joints.b2JointEdge = Xa;
    Box2D.Dynamics.Joints.b2LineJoint = ta;
    Box2D.Dynamics.Joints.b2PrismaticJointDef = ya;
    Box2D.Dynamics.Joints.b2PulleyJoint = za;
    Box2D.Dynamics.Joints.b2PulleyJointDef = Aa;
    Box2D.Dynamics.Joints.b2RevoluteJoint =
        Ba;
    Box2D.Dynamics.Joints.b2RevoluteJointDef = Ca;
    Box2D.Dynamics.Joints.b2WeldJoint = Da;
    Box2D.Dynamics.Joints.b2WeldJointDef = Ea
})();
Box2D.postDefs = [];
(function () {
    var F = Box2D.Collision.Shapes.b2CircleShape,
        G = Box2D.Collision.Shapes.b2PolygonShape,
        K = Box2D.Collision.Shapes.b2Shape,
        y = Box2D.Common.b2Settings,
        w = Box2D.Common.Math.b2Math,
        A = Box2D.Common.Math.b2Sweep,
        U = Box2D.Common.Math.b2Transform,
        p = Box2D.Common.Math.b2Vec2,
        B = Box2D.Collision.b2AABB,
        Q = Box2D.Collision.b2Bound,
        V = Box2D.Collision.b2BoundValues,
        M = Box2D.Collision.b2Collision,
        L = Box2D.Collision.b2ContactID,
        I = Box2D.Collision.b2ContactPoint,
        W = Box2D.Collision.b2Distance,
        Y = Box2D.Collision.b2DistanceInput,
        k = Box2D.Collision.b2DistanceOutput,
        z = Box2D.Collision.b2DistanceProxy,
        u = Box2D.Collision.b2DynamicTree,
        D = Box2D.Collision.b2DynamicTreeBroadPhase,
        H = Box2D.Collision.b2DynamicTreeNode,
        O = Box2D.Collision.b2DynamicTreePair,
        E = Box2D.Collision.b2Manifold,
        R = Box2D.Collision.b2ManifoldPoint,
        d = Box2D.Collision.b2SeparationFunction,
        h = Box2D.Collision.b2Simplex,
        l = Box2D.Collision.b2SimplexCache,
        j =
            Box2D.Collision.b2SimplexVertex,
        o = Box2D.Collision.b2TimeOfImpact,
        q = Box2D.Collision.b2TOIInput,
        n = Box2D.Collision.b2WorldManifold,
        a = Box2D.Collision.ClipVertex,
        c = Box2D.Collision.Features,
        g = Box2D.Collision.IBroadPhase;
    B.b2AABB = function () {
        this.lowerBound = new p;
        this.upperBound = new p
    };
    B.prototype.GetCenter = function () {
        return new p((this.lowerBound.x +
            this.upperBound.x) / 2, (this.lowerBound.y + this.upperBound.y) / 2)
        b.fraction = f;
        return true
    };
    B.prototype.TestOverlap = function (b) {
        var e = b.lowerBound.y - this.upperBound.y,
            f = this.lowerBound.y - b.upperBound.y;
        if (b.lowerBound.x - this.upperBound.x > 0 || e > 0) return false;
        if (this.lowerBound.x - b.upperBound.x > 0 || f > 0) return false;
        return true
    };
    B.prototype.Combine = function (b, e) {
        this.lowerBound.x = Math.min(b.lowerBound.x, e.lowerBound.x);
        this.lowerBound.y = Math.min(b.lowerBound.y, e.lowerBound.y);
        this.upperValues = new Vector_a2j_Number;
        this.upperValues[0] = 0;
        this.upperValues[1] = 0
    };
    M.b2Collision = function () {};
    M.ClipSegmentToLine = function (b, e, f, m) {
        if (m === undefined) m = 0;
        var r, s = 0;
        r = e[0];
    };
    M.EdgeSeparation =
        function (b, e, f, m, r) {
            if (f === undefined) f = 0;
            parseInt(b.m_vertexCount);
            var s = b.m_vertices;
            b = b.m_normals;
            var v = parseInt(m.m_vertexCount),
                t = m.m_vertices,
                x, C;
            x = e.R;
            var J = x.col1.x * b + x.col1.y * m;
            x = x.col2.x * b + x.col2.y * m;
            for (var T = 0, P = Number.MAX_VALUE, X = 0; X < v; ++X) {
                C = t[X];
                C = C.x * J + C.y * x;
            }
            C = s[f];
            x = e.R;
            f = e.position.x + (x.col1.x * C.x + x.col2.x * C.y);
        };
    M.FindMaxSeparation = function (b, e, f, m, r) {
        var s = parseInt(e.m_vertexCount),
            v = e.m_normals,
            t, x;
        var X = P = 0,
            $ = 0;
        if (x > v && x > T) {
        }
        for (;;) {
            C = $ == -1 ? P - 1 >= 0 ? P - 1 : s - 1 : P + 1 < s ? P + 1 : 0;
            v = M.EdgeSeparation(e, f, C, m, r);
            if (v > X) {
                P = C;
                X = v
            } else break
        }
        b[0] = P;
        return X
    };
    M.FindIncidentEdge = function (b, e, f, m, r, s) {
        if (m === undefined) m = 0;
        parseInt(e.m_vertexCount);
        var v = e.m_normals,
            t = parseInt(r.m_vertexCount);
        e = r.m_vertices;
        r = r.m_normals;
        var x;
        x = f.R;
        f = v[m];
        v = x.col1.x * f.x + x.col2.x * f.y;
        var C = x.col1.y * f.x + x.col2.y * f.y;
        x = 0;
        for (var J = Number.MAX_VALUE, T = 0; T < t; ++T) {
            f = r[T];
            f = v * f.x + C * f.y;
        }
        r = parseInt(x);
        v = parseInt(r + 1 < t ? r + 1 : 0);
        t = b[0];
        f = e[r];
        x = s.R;
        t.v.x = s.position.x + (x.col1.x * f.x + x.col2.x * f.y);
        t.id.features.referenceEdge = m;
        t.id.features.incidentEdge = v;
        t.id.features.incidentVertex = 1
    };
    M.MakeClipPointVector = function () {
        var b = new Vector(2);
        b[0] = new a;
        b[1] = new a;
        return b
    };
    M.CollidePolygons = function (b, e, f, m, r) {
        var s;
        b.m_pointCount = 0;
        var v = e.m_radius + m.m_radius;
        s = 0;
        M.s_edgeAO[0] = s;
        var t = M.FindMaxSeparation(M.s_edgeAO, e, f, m, r);
        s = M.s_edgeAO[0];
        if (!(t > v)) {
            var x = 0;
            M.s_edgeBO[0] = x;
            var C = M.FindMaxSeparation(M.s_edgeBO,
                m, r, e, f);
            x = M.s_edgeBO[0];
            if (!(C > v)) {
                var J = 0,
                    T = 0;
                if (C > 0.98 * t + 0.0010) {
                    t = m;
                    m = e;
                    e = r;
                } else {
                    t = e;
                    m = m;
                    e = f;
                }
                s = M.s_incidentEdge;
                M.FindIncidentEdge(s, t, e, J, m, f);
                x = parseInt(t.m_vertexCount);
                r = t.m_vertices;
                var X = M.s_tangent2;
                var $ = M.s_v11,
                    ba = M.s_v12;
                x = C.x * ba.x + C.y * ba.y + v;
                P = M.s_clipPoints1;
                t = M.s_clipPoints2;
                ba = 0;
                ba = M.ClipSegmentToLine(P, s, X, -C.x * $.x - C.y * $.y + v);
                if (!(ba < 2)) {
                    ba = M.ClipSegmentToLine(t, P, C, x);
                    if (!(ba < 2)) {
                        b.m_pointCount = r
                    }
                }
            }
        }
    };
    M.CollideCircles = function (b, e, f, m, r) {
        b.m_pointCount = 0;
    };
    Box2D.postDefs.push(function () {
        Box2D.Collision.b2Collision.s_incidentEdge =
            M.MakeClipPointVector();
        Box2D.Collision.b2Collision.s_clipPoints1 = M.MakeClipPointVector();
        Box2D.Collision.b2Collision.s_clipPoints2 = M.MakeClipPointVector();
        Box2D.Collision.b2Collision.s_edgeAO = new Vector_a2j_Number(1);
        Box2D.Collision.b2Collision.s_edgeBO = new Vector_a2j_Number(1);
        Box2D.Collision.b2Collision.s_localTangent = new p;
        Box2D.Collision.b2Collision.s_localNormal = new p;
        Box2D.Collision.b2Collision.s_v11 = new p;
        Box2D.Collision.b2Collision.s_v12 = new p;
        Box2D.Collision.b2Collision.b2CollidePolyTempVec = new p;
        Box2D.Collision.b2Collision.b2_nullFeature = 255
    });
    L.b2ContactID = function () {
        this.features = new c
    };
    L.prototype.b2ContactID = function () {
        this.features._m_id = this
    };
    L.prototype.Set = function (b) {
        this.key = b._key
    };
    L.prototype.Copy = function () {
        t.GetClosestPoint().LengthSquared();
        for (var P = 0, X, $ = 0; $ < 20;) {
            T = t.m_count;
        }
    };
    Box2D.postDefs.push(function () {
    });
    Y.b2DistanceInput = function () {};
    k.b2DistanceOutput = function () {
        this.pointA = new p;
    };
    u.b2DynamicTree = function () {};
    u.prototype.b2DynamicTree = function () {
        this.m_freeList = this.m_root = null;
        this.m_insertionCount = this.m_path = 0
    };
    u.prototype.CreateProxy = function (b, e) {
        var f = this.AllocateNode(),
            m = y.b2_aabbExtension,
            r = y.b2_aabbExtension;
        f.userData = e;
        this.InsertLeaf(f);
        return f
    };
    u.prototype.Rebalance = function (b) {
        if (b === undefined) b = 0;
    };
    u.prototype.GetFatAABB = function (b) {
        return b.aabb
    };
    u.prototype.GetUserData = function (b) {
        return b.userData
    };
    u.prototype.Query = function (b, e) {
        if (this.m_root != null) {
            var f = new Vector,
                m = 0;
            for (f[m++] =
                     this.m_root; m > 0;) {
                var r = f[--m];
                if (r.aabb.TestOverlap(e))
                    if (r.IsLeaf()) {
                        if (!b(r)) break
                    } else {
                        f[m++] = r.child1;
                        f[m++] = r.child2
                    }
            }
        }
    };
    u.prototype.RayCast = function (b, e) {
        if (this.m_root != null) {
            for (J[T++] = this.m_root; T >
                0;) {
                v = J[--T];
                if (v.aabb.TestOverlap(t) != false) {
                    x = v.aabb.GetCenter();
                    C = v.aabb.GetExtents();
                    if (!(Math.abs(r.x * (f.x - x.x) + r.y * (f.y - x.y)) - s.x * C.x - s.y * C.y > 0))
                        if (v.IsLeaf()) {
                            x = new S;
                            J[T++] = v.child1;
                            J[T++] = v.child2
                        }
                }
            }
        }
    };
    u.prototype.AllocateNode = function () {
        return new H
    };
    u.prototype.InsertLeaf = function (b) {
        ++this.m_insertionCount;
        if (this.m_root == null) {
            this.m_root = b;
            this.m_root.parent = null
        } else {
            var e = b.aabb.GetCenter(),
                f = this.m_root;
            if (f.IsLeaf() == false) {
                do {
                    var m = f.child1;
                    f = f.child2;
                    f = Math.abs((m.aabb.lowerBound.x + m.aabb.upperBound.x) / 2 - e.x) + Math.abs((m.aabb.lowerBound.y + m.aabb.upperBound.y) /
                        2 - e.y) < Math.abs((f.aabb.lowerBound.x + f.aabb.upperBound.x) / 2 - e.x) + Math.abs((f.aabb.lowerBound.y + f.aabb.upperBound.y) / 2 - e.y) ? m : f
                } while (f.IsLeaf() == false)
            }
            e = f.parent;
            m = this.AllocateNode();
            m.parent = e;
            m.userData = null;
            m.aabb.Combine(b.aabb, f.aabb);
            if (e) {
                if (f.parent.child1 == f) e.child1 = m;
                else e.child2 = m;
                this.m_root = b.parent =
                    m
            }
        }
    };
    D.b2DynamicTreeBroadPhase = function () {
        this.m_tree = new u;
        this.m_moveBuffer = new Vector;
        this.m_pairBuffer = new Vector;
        this.m_pairCount = 0
    };
    D.prototype.CreateProxy = function (b, e) {
        var f = this.m_tree.CreateProxy(b, e);
        ++this.m_proxyCount;
        this.BufferMove(f);
        return f
    };
    D.prototype.MoveProxy = function (b, e, f) {
        this.m_tree.MoveProxy(b, e, f) && this.BufferMove(b)
    };
    D.prototype.UpdatePairs = function (b) {
        var e = this;
        var f = e.m_pairCount = 0,
            m;
        for (f = 0; f < e.m_moveBuffer.length; ++f) {
            m = e.m_moveBuffer[f];
            var r = e.m_tree.GetFatAABB(m);
            e.m_tree.Query(function (t) {
                    if (t == m) return true;
                    if (e.m_pairCount == e.m_pairBuffer.length) e.m_pairBuffer[e.m_pairCount] = new O;
                    var x = e.m_pairBuffer[e.m_pairCount];
                    x.proxyA = t < m ? t : m;
                    x.proxyB = t >= m ? t : m;
                    ++e.m_pairCount;
                    return true
                },
                r)
        }
        for (f = e.m_moveBuffer.length = 0; f < e.m_pairCount;) {
            r = e.m_pairBuffer[f];
            var s = e.m_tree.GetUserData(r.proxyA),
                v = e.m_tree.GetUserData(r.proxyB);
            b(s, v);
            for (++f; f < e.m_pairCount;) {
                s = e.m_pairBuffer[f];
                if (s.proxyA != r.proxyA || s.proxyB != r.proxyB) break;
                ++f
            }
        }
        this.m_tree.Rebalance(b)
    };
    D.prototype.BufferMove =
        function (b) {
            this.m_moveBuffer[this.m_moveBuffer.length] = b
        };
    D.prototype.UnBufferMove = function (b) {
        this.m_moveBuffer.splice(parseInt(this.m_moveBuffer.indexOf(b)), 1)
    };
    H.b2DynamicTreeNode = function () {
        this.aabb = new B
    };
    H.prototype.IsLeaf = function () {
        return this.child1 == null
    };
    O.b2DynamicTreePair = function () {};
    E.b2Manifold = function () {
        this.m_pointCount = 0
    };
    E.prototype.b2Manifold = function () {
        this.m_points = new Vector(y.b2_maxManifoldPoints);
        for (var b = 0; b < y.b2_maxManifoldPoints; b++) this.m_points[b] = new R;
        this.m_localPlaneNormal = new p;
        this.m_localPoint = new p
    };
    R.b2ManifoldPoint = function () {
        this.m_localPoint = new p;
        this.m_id = new L
    };
    R.prototype.b2ManifoldPoint = function () {
    };
    d.prototype.Initialize = function (b, e, f, m, r) {
        this.m_proxyA = e;
        this.m_proxyB = m;
        var s = parseInt(b.count);
        if (s ==
            1) {
            this.m_type = d.e_points;
            v = this.m_proxyA.GetVertex(b.indexA[0]);
            t = this.m_proxyB.GetVertex(b.indexB[0]);
            s = v;
        }
    };
    d.prototype.Evaluate = function (b, e) {
        var f, m, r = 0;
        switch (this.m_type) {
            case d.e_points:
                f = w.MulTMV(b.R, this.m_axis);
                m = w.MulTMV(e.R, this.m_axis.GetNegative());
        }
    };
    Box2D.postDefs.push(function () {
        Box2D.Collision.b2SeparationFunction.e_points = 1;
        Box2D.Collision.b2SeparationFunction.e_faceA = 2;
        Box2D.Collision.b2SeparationFunction.e_faceB = 4
    });
    h.b2Simplex = function () {
        this.m_v1 = new j;
        this.m_vertices[0] = this.m_v1;
        this.indexA = new Vector_a2j_Number(3);
        this.wA.SetV(b.wA);
        this.wB.SetV(b.wB);
        this.w.SetV(b.w);
        this.a = b.a;
        this.sweepA =
            new A;
        this.sweepB = new A
    };
    n.b2WorldManifold = function () {
        this.m_normal = new p
    };
    n.prototype.b2WorldManifold = function () {
        this.m_points = new Vector(y.b2_maxManifoldPoints);
        for (var b = 0; b < y.b2_maxManifoldPoints; b++) this.m_points[b] = new p
    };
    n.prototype.Initialize = function (b, e, f, m, r) {
        if (f === undefined) f = 0;
        if (r === undefined) r = 0;
        if (b.m_pointCount != 0) {
            var s = 0,
                v, t, x = 0,
                C = 0,
                J = 0,
                T = 0,
                P = 0;
            v = 0;
            switch (b.m_type) {
                case E.e_circles:
                    t = e.R;
                    v = b.m_localPoint;
                    s = e.position.x + t.col1.x * v.x + t.col2.x * v.y;
                    T = m.position.y + t.col1.y * v.x + t.col2.y * v.y;
                    this.m_normal.x = -x;
                    this.m_normal.y = -C;
                    for (s = 0; s < b.m_pointCount; s++) {
                        t = e.R;
                        this.m_points[s].y = v + 0.5 * (r - (P - J) * x - (v - T) * C - f) * C
                    }
            }
        }
    };
    a.ClipVertex = function () {
        this.v = new p;
        this.id = new L
    };
    a.prototype.Set = function (b) {
        this.v.SetV(b.v);
        this.id.Set(b.id)
    };
    c.Features = function () {};
    Object.defineProperty(c.prototype, "referenceEdge", {
        enumerable: false,
        configurable: true,
        set: function (b) {
            if (b === undefined) b = 0;
            this._flip = b;
            this._m_id._key = this._m_id._key & 16777215 | this._flip << 24 & 4278190080
        }
    })
})();
(function () {
    var F = Box2D.Common.b2Settings,
        G = Box2D.Collision.Shapes.b2CircleShape,
        K = Box2D.Collision.Shapes.b2EdgeChainDef,
        y = Box2D.Collision.Shapes.b2EdgeShape,
        w = Box2D.Collision.Shapes.b2MassData,
        A = Box2D.Collision.Shapes.b2PolygonShape,
        U = Box2D.Collision.Shapes.b2Shape,
        p = Box2D.Common.Math.b2Mat22,
        B = Box2D.Common.Math.b2Math,
        Q = Box2D.Common.Math.b2Transform,
        V = Box2D.Common.Math.b2Vec2,
        M = Box2D.Collision.b2Distance,
        L = Box2D.Collision.b2DistanceInput,
        I = Box2D.Collision.b2DistanceOutput,
        W = Box2D.Collision.b2DistanceProxy,
        Y = Box2D.Collision.b2SimplexCache;
    Box2D.inherit(G, Box2D.Collision.Shapes.b2Shape);
    y.prototype.ComputeAABB = function (k, z) {
        this.m_nextEdge = k;
        this.m_coreV2 = z;
        this.m_cornerDir2 = u;
        this.m_cornerConvex2 = D
    };
    w.b2MassData = function () {
        this.mass = 0;
        this.center = new V(0, 0);
        this.I = 0
    };
    Box2D.inherit(A, Box2D.Collision.Shapes.b2Shape);
    A.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
    A.b2PolygonShape = function () {
        Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments)
    };
    A.prototype.Copy = function () {
        var k = new A;
        k.Set(this);
        return k
    };
    A.prototype.Set = function (k) {
        this.__super.Set.call(this, k);
        if (Box2D.is(k, A)) {
            k = k instanceof A ? k : null;
            this.m_centroid.SetV(k.m_centroid);
            this.m_vertexCount = k.m_vertexCount;
            this.Reserve(this.m_vertexCount);
        }
    };
    A.AsVector = function (k, z) {
        if (z === undefined) z = 0;
        var u = new A;
        return H
    };
    A.prototype.SetAsEdge = function (k, z) {
        this.m_vertexCount = 2;
        this.Reserve(2);
        this.m_vertices[0].SetV(k);
        this.m_vertices[1].SetV(z);
        this.m_centroid.x = 0.5 * (k.x + z.x);
        this.m_centroid.y = 0.5 * (k.y + z.y);
        this.m_normals[0] = B.CrossVF(B.SubtractVV(z, k), 1);
        this.m_normals[0].Normalize();
        this.m_normals[1].x = -this.m_normals[0].x;
    };
    A.prototype.RayCast = function (k, z, u) {
        z = O * R.col1.x + E * R.col1.y - S;
        R = O * R.col2.x + E * R.col2.y - aa;
        k.lowerBound.y = O - this.m_radius;
        k.upperBound.x = E + this.m_radius;
        k.upperBound.y = R + this.m_radius
    };
    A.prototype.ComputeMass = function (k, z) {
        if (z === undefined) z = 0;
        if (this.m_vertexCount == 2) {
            k.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
            k.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
            k.mass = 0;
            k.I = 0
        } else {
            for (var u = 0, D = 0, H = 0, O = 0, E = 1 / 3, R = 0; R < this.m_vertexCount; ++R) {
                var N =
                        this.m_vertices[R],
                    S = R + 1 < this.m_vertexCount ? this.m_vertices[parseInt(R + 1)] : this.m_vertices[0],
                    aa = N.x - 0,
                Z = Z;
                d = d;
                h = h;
                O += l * (E * (0.25 * (N * N + d * N + d * d) + (0 * N + 0 * d)) + 0 + (E * (0.25 * (Z * Z + h * Z + h * h) + (0 * Z + 0 * h)) + 0))
            }
            k.mass = z * H;
            u *= 1 / H;
            D *= 1 / H;
            k.center.Set(u, D);
            var H = this.m_vertices[D].x * k.x + this.m_vertices[D].y *
                k.y;
            if (H > u) {
                z = D;
                u = H
            }
        }
        return this.m_vertices[z]
    };
    A.prototype.Validate = function () {
        return false
    };
    A.prototype.b2PolygonShape = function () {
        this.__super.b2Shape.call(this);
        this.m_type = U.e_polygonShape;
        this.m_centroid = new V;
        this.m_vertices = new Vector;
        this.m_normals = new Vector
    };
    A.prototype.Reserve = function (k) {
        if (k === undefined) k = 0;
        for (var z = parseInt(this.m_vertices.length); z < k; z++) {
            this.m_vertices[z] = new V;
            this.m_normals[z] = new V
        }
    };
    A.ComputeCentroid = function (k, z) {
        if (z === undefined) z = 0;
        for (var u = new V, D = 0, H = 1 /
            3, O = 0; O < z; ++O) {
            if (l < 0.95 * z) {
                z = l;
                k.R.col1.x = E;
                k.R.col1.y = R;
                k.R.col2.x = S;
                k.R.col2.y = aa;
                E = 0.5 * (N + d);
                R = 0.5 * (Z + h);
                S = k.R;
                k.center.x = O.x + (S.col1.x * E + S.col2.x * R);
                k.center.y = O.y + (S.col1.y * E + S.col2.y * R);
                k.extents.x = 0.5 * (d - N);
                k.extents.y = 0.5 * (h - Z)
            }
        }
    };
    Box2D.postDefs.push(function () {
        Box2D.Collision.Shapes.b2PolygonShape.s_mat = new p
    });
    U.b2Shape = function () {};
    U.prototype.Copy = function () {
        return null
    };
    U.prototype.Set = function (k) {
        this.m_radius =
            k.m_radius
    };
    U.prototype.GetType = function () {
        return this.m_type
    };
    U.prototype.TestPoint = function () {
        return false
    };
    U.prototype.RayCast = function () {
        return false
    };
    U.prototype.ComputeAABB = function () {};
    U.prototype.b2Shape = function () {
        this.m_type = U.e_unknownShape;
        this.m_radius = F.b2_linearSlop
    };
    Box2D.postDefs.push(function () {
        Box2D.Collision.Shapes.b2Shape.e_unknownShape = parseInt(-1);
        Box2D.Collision.Shapes.b2Shape.e_circleShape = 0;
        Box2D.Collision.Shapes.b2Shape.e_polygonShape = 1;
        Box2D.Collision.Shapes.b2Shape.e_edgeShape = 2;
        Box2D.Collision.Shapes.b2Shape.e_shapeTypeCount = 3;
        Box2D.Collision.Shapes.b2Shape.e_hitCollide = 1;
        Box2D.Collision.Shapes.b2Shape.e_missCollide = 0;
        Box2D.Collision.Shapes.b2Shape.e_startsInsideCollide =
            parseInt(-1)
    })
})();
(function () {
    var F = Box2D.Common.b2Color,
        G = Box2D.Common.b2Settings,
        K = Box2D.Common.Math.b2Math;
    F.b2Color = function () {
        this._b = this._g = this._r = 0
    };
    F.prototype.b2Color = function (y, w, A) {
        if (y === undefined) y = 0;
        if (w === undefined) w = 0;
        this._r = Box2D.parseUInt(255 * K.Clamp(y,
            0, 1));
        this._g = Box2D.parseUInt(255 * K.Clamp(w, 0, 1));
        this._b = Box2D.parseUInt(255 * K.Clamp(A, 0, 1))
    };
    Object.defineProperty(F.prototype, "r", {
        enumerable: false,
        configurable: true,
    });
    G.b2Settings = function () {};
    G.b2MixFriction = function (y, w) {
        if (y === undefined) y = 0;
        if (w === undefined) w = 0;
        return Math.sqrt(y * w)
    };
    G.b2MixRestitution = function (y, w) {
        if (y === undefined) y = 0;
        if (w === undefined) w = 0;
        return y > w ? y : w
    };
    G.b2Assert = function (y) {
        if (!y) throw "Assertion Failed";
    };
    Box2D.postDefs.push(function () {
        Box2D.Common.b2Settings.VERSION =
            "2.1alpha";
        Box2D.Common.b2Settings.USHRT_MAX = 65535;
        Box2D.Common.b2Settings.b2_pi = Math.PI;
        Box2D.Common.b2Settings.b2_maxManifoldPoints = 2;
        Box2D.Common.b2Settings.b2_aabbExtension = 0.1;
        Box2D.Common.b2Settings.b2_aabbMultiplier = 2;
        Box2D.Common.b2Settings.b2_polygonRadius = 2 * G.b2_linearSlop;
    })
})();
(function () {
    var F = Box2D.Common.Math.b2Mat22,
        G = Box2D.Common.Math.b2Mat33,
        K = Box2D.Common.Math.b2Math,
        y = Box2D.Common.Math.b2Sweep,
        w = Box2D.Common.Math.b2Transform,
        A = Box2D.Common.Math.b2Vec2,
        U = Box2D.Common.Math.b2Vec3;
    F.b2Mat22 = function () {
        this.col1 = new A;
        this.col2 = new A
    };
    F.prototype.b2Mat22 = function () {
        this.SetIdentity()
    };
    F.FromAngle = function (p) {
        if (p === undefined) p = 0;
        var B = new F;
        B.Set(p);
        return B
    };
    F.FromVV = function (p, B) {
        var Q = new F;
        Q.SetVV(p, B);
        return Q
    };
    F.prototype.Set = function (p) {
        if (p === undefined) p = 0;
        var B = Math.cos(p);
        p = Math.sin(p);
        this.col1.x = B;
        this.col2.x = -p;
        this.col1.y = p;
        this.col2.y = B
    };
    F.prototype.SetVV = function (p, B) {
        this.col1.SetV(p);
        this.col2.SetV(B)
    };
    F.prototype.Copy = function () {
        this.col1.x += p.col1.x;
        this.col1.y += p.col1.y;
        this.col2.x += p.col2.x;
        this.col2.y += p.col2.y
    };
    F.prototype.SetIdentity = function () {
        this.col1.x = 1;
        this.col2.x = 0;
    };
    K.CrossVV = function (p, B) {
        return p.x *
            B.y - p.y * B.x
    };
    K.CrossVF = function (p, B) {
        if (B === undefined) B = 0;
        return new A(B * p.y, -B * p.x)
    };
    K.CrossFV = function (p, B) {
        if (p === undefined) p = 0;
        return new A(-p * B.y, p * B.x)
    };
    K.MulMV = function (p, B) {
        return new A(p.col1.x * B.x + p.col2.x * B.y, p.col1.y * B.x + p.col2.y * B.y)
    };
    K.MulTMV = function (p, B) {
        return new A(K.Dot(B, p.col1), K.Dot(B, p.col2))
    };
    K.MulX = function (p, B) {
        var Q = K.MulMV(p.R, B);
        Q.x += p.position.x;
        Q.y += p.position.y;
        return Q
    };
    K.MulXT = function (p, B) {
        var Q = K.SubtractVV(B, p.position),
            V = Q.x * p.R.col1.x + Q.y * p.R.col1.y;
        Q.y = Q.x *
            p.R.col2.x + Q.y * p.R.col2.y;
        Q.x = V;
        return Q
    };
    K.AddVV = function (p, B) {
        return new A(p.x + B.x, p.y + B.y)
    };
    K.SubtractVV = function (p, B) {
        return new A(p.x - B.x, p.y - B.y)
    };
    K.MulFV = function (p, B) {
        if (p === undefined) p = 0;
        return new A(p * B.x, p * B.y)
    };
    K.Clamp = function (p, B, Q) {
        if (p === undefined) p = 0;
        if (B === undefined) B = 0;
        if (Q === undefined) Q = 0;
    };
    y.b2Sweep = function () {
        this.localCenter =
            new A;
        this.c0 = new A;
        this.c = new A
    };
    y.prototype.Set = function (p) {
        this.localCenter.SetV(p.localCenter);
        this.c0.SetV(p.c0);
        this.c.SetV(p.c);
        this.a0 = p.a0;
        this.a = p.a;
        p.position.y -= Q.col1.y * this.localCenter.x + Q.col2.y * this.localCenter.y
    };
    y.prototype.Advance = function (p) {
        if (p === undefined) p = 0;
        if (this.t0 < p && 1 - this.t0 > Number.MIN_VALUE) {
            var B = (p - this.t0) / (1 - this.t0);
            this.c0.x = (1 - B) * this.c0.x + B * this.c.x;
            this.c0.y = (1 - B) * this.c0.y + B * this.c.y;
            this.a0 = (1 - B) * this.a0 + B * this.a;
            this.t0 = p
        }
    };
    w.b2Transform = function () {
        this.position = new A;
        this.R = new F
    };
    w.prototype.b2Transform = function (p, B) {
    };
    w.prototype.GetAngle = function () {
        return Math.atan2(this.R.col1.y, this.R.col1.x)
    };
    A.b2Vec2 = function () {};
    A.prototype.b2Vec2 = function (p, B) {
        if (p === undefined) p = 0;
        if (B === undefined) B = 0;
        this.x = p;
        this.y = B
    };
    A.prototype.SetZero = function () {
        this.y = this.x = 0
    };
    A.prototype.Set = function (p, B) {
        if (p === undefined) p = 0;
        if (B === undefined) B = 0;
        this.x = p;
        this.y = B
    };
    A.prototype.SetV = function (p) {
        this.x = p.x;
        this.y = p.y
    };
    A.prototype.GetNegative = function () {
        return new A(-this.x, -this.y)
    };
    A.prototype.NegativeSelf = function () {
        this.x = -this.x;
        this.y = -this.y
    };
    A.Make = function (p, B) {
        if (p === undefined) p = 0;
        if (B === undefined) B = 0;
        return new A(p, B)
    };
    A.prototype.Copy = function () {
        return new A(this.x, this.y)
    };
    A.prototype.Add = function (p) {
        this.x += p.x;
        this.y += p.y
    };
    A.prototype.Subtract = function (p) {
        this.x -= p.x;
        this.x = p.col1.x * B + p.col2.x * this.y;
        this.y = p.col1.y * B + p.col2.y * this.y
    };
    A.prototype.Normalize = function () {
    };
    U.prototype.SetZero = function () {
        this.x = this.y = this.z = 0
        if (p === undefined) p = 0;
        this.x *= p;
        this.y *= p;
        this.z *= p
    }
})();
(function () {
    var F = Box2D.Common.Math.b2Math,
        G = Box2D.Common.Math.b2Sweep,
        K = Box2D.Common.Math.b2Transform,
        y = Box2D.Common.Math.b2Vec2,
        w = Box2D.Common.b2Color,
        A = Box2D.Common.b2Settings,
        U = Box2D.Collision.b2AABB,
        p = Box2D.Collision.b2ContactPoint,
        B = Box2D.Collision.b2DynamicTreeBroadPhase,
        Q = Box2D.Collision.b2RayCastInput,
        V = Box2D.Collision.b2RayCastOutput,
        M = Box2D.Collision.Shapes.b2CircleShape,
        L = Box2D.Collision.Shapes.b2EdgeShape,
        I = Box2D.Collision.Shapes.b2MassData,
        W = Box2D.Collision.Shapes.b2PolygonShape,
        Y = Box2D.Collision.Shapes.b2Shape,
        k = Box2D.Dynamics.b2Body,
        z = Box2D.Dynamics.b2BodyDef,
        u = Box2D.Dynamics.b2ContactFilter,
        D = Box2D.Dynamics.b2ContactImpulse,
        H = Box2D.Dynamics.b2ContactListener,
        O = Box2D.Dynamics.b2ContactManager,
        E = Box2D.Dynamics.b2DebugDraw,
        R = Box2D.Dynamics.b2DestructionListener,
        N = Box2D.Dynamics.b2FilterData,
        S = Box2D.Dynamics.b2Fixture,
        aa = Box2D.Dynamics.b2FixtureDef,
        Z = Box2D.Dynamics.b2Island,
        d = Box2D.Dynamics.b2TimeStep,
        h = Box2D.Dynamics.b2World,
        l = Box2D.Dynamics.Contacts.b2Contact,
        j = Box2D.Dynamics.Contacts.b2ContactFactory,
        o = Box2D.Dynamics.Contacts.b2ContactSolver,
        q = Box2D.Dynamics.Joints.b2Joint,
        n = Box2D.Dynamics.Joints.b2PulleyJoint;
    k.b2Body = function () {
        this.m_xf = new K;
        this.m_sweep = new G;
        this.m_linearVelocity = new y;
        this.m_force = new y
    };
    k.prototype.connectEdges = function (a, c, g) {
        var f = F.Dot(a.GetDirectionVector(), c.GetNormalVector()) > 0;
        a.SetNextEdge(c, g, e, f);
        c.SetPrevEdge(a, g, e, f);
        return b
    };
    k.prototype.CreateFixture = function (a) {
        if (this.m_world.IsLocked() == true) return null;
        var c = new S;
        c.Create(this, this.m_xf, a);
        this.m_flags & k.e_activeFlag && c.CreateProxy(this.m_world.m_contactManager.m_broadPhase, this.m_xf);
        c.m_next = this.m_fixtureList;
        this.m_fixtureList = c;
        ++this.m_fixtureCount;
        c.m_body = this;
        c.m_density > 0 && this.ResetMassData();
        this.m_world.m_flags |=
            h.e_newFixture;
    };
    k.prototype.ResetMassData = function () {
        this.m_invI = this.m_I = this.m_invMass = this.m_mass = 0;
        this.m_sweep.localCenter.SetZero();
        if (!(this.m_type == k.b2_staticBody || this.m_type == k.b2_kinematicBody)) {
            for (var a = y.Make(0, 0), c = this.m_fixtureList; c; c = c.m_next)
                if (c.m_density != 0) {
                    var g = c.GetMassData();
                    this.m_mass += g.mass;
                    a.x += g.center.x * g.mass;
                    a.y += g.center.y * g.mass;
                    this.m_I += g.I
                }
            if (this.m_mass > 0) {
                this.m_invMass = 1 / this.m_mass;
                a.x *= this.m_invMass;
                a.y *= this.m_invMass
            } else this.m_invMass = this.m_mass = 1; if (this.m_I > 0 && (this.m_flags & k.e_fixedRotationFlag) == 0) {
                this.m_I -= this.m_mass * (a.x * a.x + a.y * a.y);
                this.m_I *= this.m_inertiaScale;
                A.b2Assert(this.m_I >
                    0);
                this.m_invI = 1 / this.m_I
            } else this.m_invI = this.m_I = 0;
            c = this.m_sweep.c.Copy();
            this.m_sweep.localCenter.SetV(a);
            this.m_sweep.c0.SetV(F.MulX(this.m_xf, this.m_sweep.localCenter));
            this.m_sweep.c.SetV(this.m_sweep.c0);
            this.m_linearVelocity.x += this.m_angularVelocity * -(this.m_sweep.c.y - c.y);
        }
    };
    k.prototype.GetType = function () {
        return this.m_type
    };
    k.prototype.SetBullet = function (a) {
        if (a) this.m_flags |=
            k.e_bulletFlag;
        else this.m_flags &= ~k.e_bulletFlag
    };
    k.prototype.IsBullet = function () {
        return (this.m_flags & k.e_bulletFlag) == k.e_bulletFlag
    };
    k.prototype.SetSleepingAllowed = function (a) {
        if (a) this.m_flags |= k.e_allowSleepFlag;
        else {
            this.m_flags &= ~k.e_allowSleepFlag;
            this.SetAwake(true)
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0;
            this.m_force.SetZero();
            this.m_torque =
                0
        }
    };
    k.prototype.IsAwake = function () {
        return (this.m_flags & k.e_awakeFlag) == k.e_awakeFlag
        if (a != this.IsActive()) {
            var c;
            if (a) {
                this.m_flags |= k.e_activeFlag;
                a = this.m_world.m_contactManager.m_broadPhase;
                for (c = this.m_fixtureList; c; c =
                    c.m_next) c.CreateProxy(a, this.m_xf)
            } else {
                this.m_flags &= ~k.e_activeFlag;
                a = this.m_world.m_contactManager.m_broadPhase;
                for (c = this.m_fixtureList; c; c = c.m_next) c.DestroyProxy(a);
                for (a = this.m_contactList; a;) {
                    c = a;
                    a = a.next;
                    this.m_world.m_contactManager.Destroy(c.contact)
                }
                this.m_contactList = null
            }
        }
    };
    k.prototype.IsActive = function () {
        return (this.m_flags & k.e_activeFlag) == k.e_activeFlag
    };
    k.prototype.IsSleepingAllowed = function () {
        return (this.m_flags & k.e_allowSleepFlag) == k.e_allowSleepFlag
    };
    k.prototype.GetFixtureList =
        function () {
    };
    k.prototype.GetWorld = function () {
        return this.m_world
    };
    k.prototype.b2Body = function (a, c) {
        this.m_flags = 0;
        if (a.bullet) this.m_flags |= k.e_bulletFlag;
        if (a.fixedRotation) this.m_flags |= k.e_fixedRotationFlag;
        if (a.allowSleep) this.m_flags |= k.e_allowSleepFlag;
        if (a.awake) this.m_flags |= k.e_awakeFlag;
        if (a.active) this.m_flags |= k.e_activeFlag;
        this.m_world = c;
        this.m_xf.position.SetV(a.position);
        this.m_xf.R.Set(a.angle);
        this.m_sweep.localCenter.SetZero();
        this.m_sweep.t0 = 1;
        this.m_sweep.a0 = this.m_sweep.a = a.angle;
        var g = this.m_xf.R,
            b = this.m_sweep.localCenter;
        this.m_linearVelocity.SetV(a.linearVelocity);
        this.m_angularVelocity = a.angularVelocity;
        this.m_linearDamping = a.linearDamping;
        this.m_angularDamping = a.angularDamping;
        this.m_force.Set(0, 0);
        this.m_sleepTime = this.m_torque = 0;
        this.m_type = a.type;
        if (this.m_type ==
            k.b2_dynamicBody) this.m_invMass = this.m_mass = 1;
        else this.m_invMass = this.m_mass = 0;
        this.m_invI = this.m_I = 0;
        this.m_inertiaScale = a.inertiaScale;
        this.m_userData = a.userData;
        this.m_fixtureList = null;
        this.m_fixtureCount = 0
    };
    k.prototype.SynchronizeFixtures = function () {
        var a = k.s_xf1;
        this.m_xf.R.Set(this.m_sweep.a);
        var a = this.m_xf.R,
            c = this.m_sweep.localCenter;
        this.m_xf.position.x = this.m_sweep.c.x - (a.col1.x * c.x + a.col2.x * c.y);
        this.m_xf.position.y = this.m_sweep.c.y - (a.col1.y * c.x + a.col2.y * c.y)
    };
    k.prototype.ShouldCollide = function (a) {
        if (this.m_type != k.b2_dynamicBody && a.m_type != k.b2_dynamicBody) return false;
        for (var c = this.m_jointList; c; c = c.next)
        this.SynchronizeTransform()
    };
    Box2D.postDefs.push(function () {
        Box2D.Dynamics.b2Body.s_xf1 = new K;
        Box2D.Dynamics.b2Body.e_islandFlag = 1;
        Box2D.Dynamics.b2Body.e_awakeFlag = 2;
        Box2D.Dynamics.b2Body.e_allowSleepFlag = 4;
        Box2D.Dynamics.b2Body.e_bulletFlag = 8;
        Box2D.Dynamics.b2Body.e_fixedRotationFlag = 16;
        Box2D.Dynamics.b2Body.e_activeFlag = 32;
        Box2D.Dynamics.b2Body.b2_staticBody =
            0;
        Box2D.Dynamics.b2Body.b2_kinematicBody = 1;
        Box2D.Dynamics.b2Body.b2_dynamicBody = 2
    });
    z.b2BodyDef = function () {
        this.position = new y;
        this.linearVelocity = new y
    };
    z.prototype.b2BodyDef = function () {
        this.userData = null;
        this.position.Set(0, 0);
        this.angle = 0;
        this.linearVelocity.Set(0, 0);
        this.angularDamping = this.linearDamping = this.angularVelocity = 0;
        this.awake = this.allowSleep = true;
        this.bullet = this.fixedRotation = false;
        this.type = k.b2_staticBody;
        this.active = true;
        this.inertiaScale = 1
    };
    u.b2ContactFilter = function () {};
    u.prototype.ShouldCollide =
        function (a, c) {
            var g = a.GetFilterData(),
                b = c.GetFilterData();
            if (g.groupIndex == b.groupIndex && g.groupIndex != 0) return g.groupIndex > 0;
            return (g.maskBits & b.categoryBits) != 0 && (g.categoryBits & b.maskBits) != 0
        };
    u.prototype.RayCollide = function (a, c) {
        if (!a) return true;
        return this.ShouldCollide(a instanceof S ? a : null, c)
    };
    Box2D.postDefs.push(function () {
        Box2D.Dynamics.b2ContactFilter.b2_defaultFilter = new u
    });
    D.b2ContactImpulse = function () {
        this.normalImpulses = new Vector_a2j_Number(A.b2_maxManifoldPoints);
        this.tangentImpulses =
            new Vector_a2j_Number(A.b2_maxManifoldPoints)
    };
    H.b2ContactListener = function () {};
    H.prototype.BeginContact = function () {};
    H.prototype.EndContact = function () {};
    H.prototype.PreSolve = function () {};
    H.prototype.PostSolve = function () {};
    Box2D.postDefs.push(function () {
        Box2D.Dynamics.b2ContactListener.b2_defaultListener = new H
    });
    O.b2ContactManager = function () {};
    O.prototype.b2ContactManager = function () {
        this.m_world = null;
        this.m_contactCount = 0;
        this.m_contactFilter = u.b2_defaultFilter;
        this.m_contactListener = H.b2_defaultListener;
        this.m_contactFactory = new j(this.m_allocator);
        this.m_broadPhase = new B
    };
    O.prototype.AddPair = function (a, c) {
        var g = a instanceof S ? a : null,
            b = c instanceof S ? c : null,
            e = g.GetBody(),
            f = b.GetBody();
        if (e != f) {
            if (f.ShouldCollide(e) != false)
                if (this.m_contactFilter.ShouldCollide(g, b) != false) {
                    m = this.m_contactFactory.Create(g, b);
                    g = m.GetFixtureA();
                    b = m.GetFixtureB();
                    e = g.m_body;
                    f = b.m_body;
                    m.m_prev = null;
                    m.m_next = this.m_world.m_contactList;
                    if (this.m_world.m_contactList != null) this.m_world.m_contactList.m_prev = m;
                    this.m_world.m_contactList = m;
                    m.m_nodeB.next = f.m_contactList;
                    if (f.m_contactList != null) f.m_contactList.prev = m.m_nodeB;
                    f.m_contactList =
                        m.m_nodeB;
                    ++this.m_world.m_contactCount
                }
        }
    };
    O.prototype.FindNewContacts = function () {
        this.m_broadPhase.UpdatePairs(Box2D.generateCallback(this, this.AddPair))
    };
    O.prototype.Destroy = function (a) {
        var c = a.GetFixtureA(),
            g = a.GetFixtureB();
        c = c.GetBody();
        g = g.GetBody();
        a.IsTouching() && this.m_contactListener.EndContact(a);
        this.m_contactFactory.Destroy(a);
        --this.m_contactCount
    };
    O.prototype.Collide = function () {
        for (var a = this.m_world.m_contactList; a;) {
            var c = a.GetFixtureA(),
                g = a.GetFixtureB(),
                b = c.GetBody(),
                e = g.GetBody();
            if (b.IsAwake() == false && e.IsAwake() ==
                false) a = a.GetNext();
            else {
                if (a.m_flags & l.e_filterFlag) {
                    if (e.ShouldCollide(b) == false) {
                        c = a;
                        a = c.GetNext();
                        this.Destroy(c);
                        continue
                    }
                    c = a;
                    a = c.GetNext();
                    this.Destroy(c)
                } else {
                    a.Update(this.m_contactListener);
                    a = a.GetNext()
                }
            }
        }
    };
    R.b2DestructionListener = function () {};
    R.prototype.SayGoodbyeJoint = function () {};
    R.prototype.SayGoodbyeFixture = function () {};
    N.b2FilterData = function () {
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0
    };
    N.prototype.Copy = function () {
        var a = new N;
        a.categoryBits = this.categoryBits;
        a.maskBits = this.maskBits;
        a.groupIndex = this.groupIndex;
        return a
    };
    S.b2Fixture = function () {
        this.m_filter =
            new N
    };
    S.prototype.GetType = function () {
        return this.m_shape.GetType()
    };
    S.prototype.GetShape = function () {
        return this.m_shape
    };
    S.prototype.SetSensor = function (a) {
        if (this.m_isSensor != a) {
        }
    };
    S.prototype.IsSensor = function () {
        return this.m_isSensor
    };
    S.prototype.SetFilterData = function (a) {
        this.m_filter = a.Copy();
        if (!this.m_body)
            for (a =
                     this.m_body.GetContactList(); a;) {
                var c = a.contact,
                    g = c.GetFixtureA(),
                    b = c.GetFixtureB();
                if (g == this || b == this) c.FlagForFiltering();
                a = a.next
            }
    };
    S.prototype.GetFilterData = function () {
        return this.m_filter.Copy()
    };
    S.prototype.GetBody = function () {
        return this.m_body
    };
    S.prototype.GetNext = function () {
        return this.m_next
    };
    S.prototype.GetUserData = function () {
        return this.m_userData
    };
    S.prototype.GetMassData = function (a) {
        if (a === undefined) a = null;
        if (a == null) a = new I;
        this.m_shape.ComputeMass(a, this.m_density);
        return a
    };
    S.prototype.SetRestitution = function (a) {
        if (a === undefined) a = 0;
        this.m_restitution = a
    };
    S.prototype.GetAABB = function () {
        return this.m_aabb
    };
    S.prototype.b2Fixture = function () {
        this.m_aabb = new U;
        this.m_shape = this.m_next = this.m_body = this.m_userData = null;
        this.m_restitution = this.m_friction = this.m_density = 0
    };
    S.prototype.Create = function (a, c, g) {
        this.m_userData = g.userData;
        this.m_friction = g.friction;
        this.m_restitution = g.restitution;
        this.m_body = a;
        this.m_next = null;
        this.m_filter = g.filter.Copy();
        this.m_isSensor = g.isSensor;
        this.m_shape = g.shape.Copy();
        this.m_density = g.density
    };
    S.prototype.Destroy = function () {
        this.m_shape = null
    };
    S.prototype.CreateProxy = function (a, c) {
        this.m_shape.ComputeAABB(this.m_aabb, c);
        this.m_proxy = a.CreateProxy(this.m_aabb, this)
    };
    S.prototype.DestroyProxy = function (a) {
        if (this.m_proxy != null) {
            a.DestroyProxy(this.m_proxy);
            this.m_proxy = null
        }
    };
    S.prototype.Synchronize = function (a, c, g) {
        if (this.m_proxy) {
            var b = new U,
                e = new U;
            this.m_shape.ComputeAABB(b, c);
            this.m_shape.ComputeAABB(e, g);
            this.m_aabb.Combine(b, e);
            c = F.SubtractVV(g.position, c.position);
            a.MoveProxy(this.m_proxy, this.m_aabb, c)
        }
    };
    aa.b2FixtureDef = function () {
        this.filter = new N
    };
    aa.prototype.b2FixtureDef = function () {
        this.userData = this.shape = null;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.filter.categoryBits = 1;
        this.filter.maskBits = 65535;
        this.filter.groupIndex = 0;
        this.isSensor = false
    };
    Z.b2Island = function () {};
    Z.prototype.b2Island = function () {
        this.m_bodies = new Vector;
        this.m_contacts = new Vector;
        this.m_joints = new Vector
    };
    Z.prototype.Initialize = function (a, c, g, b, e, f) {
        if (a === undefined) a = 0;
        this.m_contactSolver = f;
        for (m = this.m_bodies.length; m < a; m++) this.m_bodies[m] = null;
        for (m = this.m_contacts.length; m < c; m++) this.m_contacts[m] = null;
        for (m = this.m_joints.length; m < g; m++) this.m_joints[m] = null
    };
    Z.prototype.Clear = function () {
        this.m_jointCount =
            this.m_contactCount = this.m_bodyCount = 0
    };
    Z.prototype.Solve = function (a, c, g) {
        var b = 0,
            e = 0,
            f;
        for (b = 0; b < this.m_bodyCount; ++b) {
            e = this.m_bodies[b];
            if (e.GetType() == k.b2_dynamicBody) {
                e.m_linearVelocity.x += a.dt * (c.x + e.m_invMass * e.m_force.x);
            }
            if (g >= A.b2_timeToSleep)
                for (b = 0; b < this.m_bodyCount; ++b) {
                    e = this.m_bodies[b];
                    e.SetAwake(false)
                }
        }
    };
    Z.prototype.SolveTOI = function (a) {
        var c = 0,
            g = 0;
        this.m_contactSolver.Initialize(a, this.m_contacts, this.m_contactCount,
            this.m_allocator);
        var b = this.m_contactSolver;
        for (c = 0; c < this.m_jointCount; ++c) this.m_joints[c].InitVelocityConstraints(a);
        for (c = 0; c < a.velocityIterations; ++c) {
            b.SolveVelocityConstraints();
            for (g = 0; g < this.m_jointCount; ++g) this.m_joints[g].SolveVelocityConstraints(a)
        }
        for (c = 0; c < this.m_bodyCount; ++c) {
            g = this.m_bodies[c];
                this.m_listener.PostSolve(g, Z.s_impulse)
            }
    };
    Z.prototype.AddBody = function (a) {
        a.m_islandIndex =
            this.m_bodyCount;
        this.m_bodies[this.m_bodyCount++] = a
    };
    d.b2TimeStep = function () {};
    d.prototype.Set = function (a) {
        this.dt = a.dt;
        this.inv_dt = a.inv_dt;
        this.positionIterations = a.positionIterations;
        this.velocityIterations = a.velocityIterations;
        this.warmStarting = a.warmStarting
    };
    h.b2World = function () {
        this.s_stack =
            new Vector;
        this.m_contactManager = new O;
        this.m_contactSolver = new o;
        this.m_island = new Z
    };
    h.prototype.b2World = function (a, c) {
        this.m_controllerList = this.m_jointList = this.m_contactList = this.m_bodyList = this.m_debugDraw = this.m_destructionListener = null;
        this.m_controllerCount = this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
        h.m_warmStarting = true;
        h.m_continuousPhysics = true;
        this.m_allowSleep = c;
        this.m_gravity = a;
        this.m_inv_dt0 = 0;
        this.m_contactManager.m_world = this;
        this.m_groundBody = this.CreateBody(new z)
    };
    h.prototype.SetDestructionListener = function (a) {
        this.m_destructionListener = a
        this.m_contactManager.m_broadPhase.Validate()
    };
    h.prototype.GetProxyCount = function () {
        return this.m_contactManager.m_broadPhase.GetProxyCount()
    };
    h.prototype.CreateBody = function (a) {
        if (this.IsLocked() == true) return null;
        a = new k(a, this);
        a.m_prev = null;
        if (a.m_next = this.m_bodyList) this.m_bodyList.m_prev = a;
        this.m_bodyList = a;
        ++this.m_bodyCount;
        return a
    };
    h.prototype.DestroyBody = function (a) {
        if (this.IsLocked() != true) {
            for (var c = a.m_jointList; c;) {
                var g =
                    c;
                c = c.next;
                this.m_destructionListener && this.m_destructionListener.SayGoodbyeJoint(g.joint);
                this.DestroyJoint(g.joint)
            }
            for (c = a.m_controllerList; c;) {
                g = c;
                c = c.nextController;
                g.controller.RemoveBody(a)
            }
            if (a == this.m_bodyList) this.m_bodyList = a.m_next;
            --this.m_bodyCount
        }
    };
    h.prototype.CreateJoint = function (a) {
        var c = q.Create(a, null);
        c.m_prev = null;
        if (c.m_next = this.m_jointList) this.m_jointList.m_prev = c;
        this.m_jointList = c;
    };
    h.prototype.GetGroundBody = function () {
        return this.m_groundBody
    };
    h.prototype.Step = function (a, c, g) {
        if (a === undefined) a = 0;
        if (c === undefined) c = 0;
        if (g === undefined) g = 0;
        if (this.m_flags & h.e_newFixture) {
            this.m_contactManager.FindNewContacts();
            this.m_flags &= ~h.e_newFixture
        }
        this.m_flags |= h.e_locked;
        var b = h.s_timestep2;
        b.dt = a;
        b.velocityIterations = c;
        b.positionIterations = g;
        b.inv_dt = a > 0 ? 1 / a : 0;
        b.dtRatio = this.m_inv_dt0 * a;
        b.warmStarting = h.m_warmStarting;
        this.m_contactManager.Collide();
        b.dt > 0 && this.Solve(b);
        h.m_continuousPhysics && b.dt > 0 && this.SolveTOI(b);
        if (b.dt > 0) this.m_inv_dt0 = b.inv_dt;
        this.m_flags &= ~h.e_locked
    };
    h.prototype.ClearForces = function () {
        for (var a = this.m_bodyList; a; a = a.m_next) {
                    c, g, b;
                    for (c = this.m_bodyList; c; c = c.m_next) {
                        e = c.m_xf;
                        for (g = c.GetFixtureList(); g; g = g.m_next) {
                            b = g.GetShape();
                            if (c.IsActive() == false) f.Set(0.5, 0.5, 0.3);
                            else if (c.GetType() == k.b2_staticBody) f.Set(0.5, 0.9, 0.5);
                            else if (c.GetType() == k.b2_kinematicBody) f.Set(0.5, 0.5, 0.9);
                            else c.IsAwake() == false ?
                                    f.Set(0.6, 0.6, 0.6) : f.Set(0.9, 0.7, 0.7);
                        b = c.GetFixtureA();
                        g = c.GetFixtureB();
                        b = b.GetAABB().GetCenter();
                        g = g.GetAABB().GetCenter();
                        this.m_debugDraw.DrawSegment(b, g, f)
                    }
                }
        }
    };
    h.prototype.RayCast = function (a, c, g) {
    };
    h.prototype.GetContactList = function () {
        return this.m_contactList
    };
    h.prototype.IsLocked = function () {
        return (this.m_flags &
            h.e_locked) > 0
    };
    h.prototype.Solve = function (a) {
        for (var c, g = this.m_controllerList; g; g = g.m_next) g.Step(a);
        g = this.m_island;
        g.Initialize(this.m_bodyCount, this.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
        for (c = this.m_bodyList; c; c = c.m_next) c.m_flags &= ~k.e_islandFlag;
        for (var b = this.m_contactList; b; b = b.m_next) b.m_flags &= ~l.e_islandFlag;
        for (b = this.m_jointList; b; b = b.m_next) b.m_islandFlag = false;
        parseInt(this.m_bodyCount);
        b = this.s_stack;
        for (var e = this.m_bodyList; e; e =
            e.m_next)
            if (!(e.m_flags & k.e_islandFlag))
                if (!(e.IsAwake() == false || e.IsActive() == false))
                    if (e.GetType() != k.b2_staticBody) {
                        g.Clear();
                        var f = 0;
                        b[f++] = e;
                        for (e.m_flags |= k.e_islandFlag; f > 0;) {
                            c = b[--f];
                        }
                        g.Solve(a, this.m_gravity, this.m_allowSleep);
                        for (f = 0; f < g.m_bodyCount; ++f) {
                            c = g.m_bodies[f];
                            if (c.GetType() == k.b2_staticBody) c.m_flags &= ~k.e_islandFlag
                        }
                    }
        for (f = 0; f < b.length; ++f) {
            if (!b[f]) break;
            b[f] = null
        }
        for (c = this.m_bodyList; c; c =
            c.m_next) c.IsAwake() == false || c.IsActive() == false || c.GetType() != k.b2_staticBody && c.SynchronizeFixtures();
        this.m_contactManager.FindNewContacts()
    };
    h.prototype.SolveTOI = function (a) {
        var c, g, b, e = this.m_island;
        e.Initialize(this.m_bodyCount, A.b2_maxTOIContactsPerIsland, A.b2_maxTOIJointsPerIsland, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
        var f = h.s_queue;
        for (c = this.m_bodyList; c; c = c.m_next) {
            c.m_flags &= ~k.e_islandFlag;
            c.m_sweep.t0 = 0
        }
        for (b = this.m_contactList; b; b = b.m_next) b.m_flags &= ~(l.e_toiFlag |
            l.e_islandFlag);
        for (b = this.m_jointList; b; b = b.m_next) b.m_islandFlag = false;
        for (;;) {
            var m = null,
                r = 1;
            for (b = this.m_contactList; b; b = b.m_next)
                if (!(b.IsSensor() == true || b.IsEnabled() == false || b.IsContinuous() == false)) {
                    c = 1;
                    if (b.m_flags & l.e_toiFlag) c = b.m_toi;
                    else {
                        c = b.m_fixtureA;
                        g = b.m_fixtureB;
                        c = c.m_body;
                        g = g.m_body;
                        m = b;
                        r = c
                    }
                }
            if (m == null || 1 - 100 * Number.MIN_VALUE < r) break;
            c = m.m_fixtureA;
            g = m.m_fixtureB;
            c = c.m_body;
            g = g.m_body;
            h.s_backupA.Set(c.m_sweep);
            h.s_backupB.Set(g.m_sweep);
            c.Advance(r);
            g.Advance(r);
            m.Update(this.m_contactManager.m_contactListener);
            m.m_flags &= ~l.e_toiFlag;
            if (m.IsSensor() == true || m.IsEnabled() ==
                false) {
                c.m_sweep.Set(h.s_backupA);
                for (c.m_flags |= k.e_islandFlag; m > 0;) {
                    c = f[b++];
                    --m;
                    e.AddBody(c);
                    c.IsAwake() == false && c.SetAwake(true);
                    if (c.GetType() == k.b2_dynamicBody) {
                        for (g = c.m_contactList; g; g = g.next) {
                            if (e.m_contactCount == e.m_contactCapacity) break;
                            if (!(g.contact.m_flags & l.e_islandFlag))
                                    s = c.other;
                                    if (s.IsActive() != false) {
                                        e.AddJoint(c.joint);
                                        c.joint.m_islandFlag = true;
                                        if (!(s.m_flags & k.e_islandFlag)) {
                                            if (s.GetType() != k.b2_staticBody) {
                                                s.Advance(r);
                                                s.SetAwake(true)
                                            }
                                            f[b +
                                                m] = s;
                                            ++m;
                                            s.m_flags |= k.e_islandFlag
                                        }
                                    }
                                }
                    }
                    b = e.m_contacts[r];
                    b.m_flags &= ~(l.e_toiFlag |
                        l.e_islandFlag)
                }
                for (r = 0; r < e.m_jointCount; ++r) {
                    b = e.m_joints[r];
                    b.m_islandFlag = false
                }
                this.m_contactManager.FindNewContacts()
            }
        }
    };
    h.prototype.DrawJoint = function (a) {
        var c = a.GetBodyA(),
            g = a.GetBodyB(),
            b = c.m_xf.position,
            e = g.m_xf.position,
            f = a.GetAnchorA(),
            m = a.GetAnchorB(),
            r = h.s_jointColor;
        switch (a.m_type) {
            case q.e_distanceJoint:
                this.m_debugDraw.DrawSegment(f, m, r);
                break;
            case q.e_pulleyJoint:
                c = a instanceof n ? a : null;
                a = c.GetGroundAnchorA();
                c = c.GetGroundAnchorB();
                this.m_debugDraw.DrawSegment(a, f, r);
                b = a instanceof L ? a : null;
                this.m_debugDraw.DrawSegment(F.MulX(c, b.GetVertex1()), F.MulX(c, b.GetVertex2()), g)
        }
    };
    Box2D.postDefs.push(function () {
        Box2D.Dynamics.b2World.s_timestep2 = new d;
        Box2D.Dynamics.b2World.s_xf = new K;
        Box2D.Dynamics.b2World.s_backupA = new G;
        Box2D.Dynamics.b2World.s_backupB = new G;
        Box2D.Dynamics.b2World.s_timestep = new d;
        Box2D.Dynamics.b2World.s_queue = new Vector;
        Box2D.Dynamics.b2World.s_jointColor = new w(0.5, 0.8, 0.8);
        Box2D.Dynamics.b2World.e_newFixture = 1;
        Box2D.Dynamics.b2World.e_locked = 2
    })
})();
(function () {
    var F = Box2D.Collision.Shapes.b2CircleShape,
        G = Box2D.Collision.Shapes.b2EdgeShape,
        K = Box2D.Collision.Shapes.b2PolygonShape,
        y = Box2D.Collision.Shapes.b2Shape,
        w = Box2D.Dynamics.Contacts.b2CircleContact,
        A = Box2D.Dynamics.Contacts.b2Contact,
        U = Box2D.Dynamics.Contacts.b2ContactConstraint,
        p = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
        B = Box2D.Dynamics.Contacts.b2ContactEdge,
        Q = Box2D.Dynamics.Contacts.b2ContactFactory,
        V = Box2D.Dynamics.Contacts.b2ContactRegister,
        M = Box2D.Dynamics.Contacts.b2ContactResult,
        L = Box2D.Dynamics.Contacts.b2ContactSolver,
        I = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
        W = Box2D.Dynamics.Contacts.b2NullContact,
        Y = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
        k = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
        z = Box2D.Dynamics.Contacts.b2PolygonContact,
        u = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
        D = Box2D.Dynamics.b2Body,
        H = Box2D.Dynamics.b2TimeStep,
        O = Box2D.Common.b2Settings,
        E = Box2D.Common.Math.b2Mat22,
        R = Box2D.Common.Math.b2Math,
        N = Box2D.Common.Math.b2Vec2,
        S = Box2D.Collision.b2Collision,
        aa = Box2D.Collision.b2ContactID,
        Z = Box2D.Collision.b2Manifold,
        d = Box2D.Collision.b2TimeOfImpact,
        h = Box2D.Collision.b2TOIInput,
        l = Box2D.Collision.b2WorldManifold;
    Box2D.inherit(w, Box2D.Dynamics.Contacts.b2Contact);
    w.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
    w.b2CircleContact = function () {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
    };
    w.Create = function () {
        return new w
    };
    A.b2Contact = function () {
        this.m_nodeA = new B;
        this.m_nodeB = new B;
        this.m_manifold = new Z;
        this.m_oldManifold = new Z
    };
    A.prototype.GetManifold = function () {
    };
    A.prototype.IsSensor = function () {
        return (this.m_flags &
            A.e_sensorFlag) == A.e_sensorFlag
    };
    A.prototype.SetEnabled = function (j) {
        if (j) this.m_flags |= A.e_enabledFlag;
        else this.m_flags &= ~A.e_enabledFlag
    };
    A.prototype.IsEnabled = function () {
        return (this.m_flags & A.e_enabledFlag) == A.e_enabledFlag
    };
    A.prototype.GetNext = function () {
        return this.m_next
    };
    A.prototype.GetFixtureA = function () {
        return this.m_fixtureA
    };
    A.prototype.GetFixtureB = function () {
        return this.m_fixtureB
    };
    A.prototype.FlagForFiltering = function () {
        this.m_flags |= A.e_filterFlag
    };
    A.prototype.b2Contact = function () {};
    A.prototype.Reset = function (j, o) {
        if (j === undefined) j = null;
        if (o === undefined) o = null;
        this.m_flags = A.e_enabledFlag;
        if (!j || !o) this.m_fixtureB = this.m_fixtureA = null;
        else {
            if (j.IsSensor() || o.IsSensor()) this.m_flags |= A.e_sensorFlag;
            var q = j.GetBody(),
                n = o.GetBody();
            if (q.GetType() != D.b2_dynamicBody || q.IsBullet() || n.GetType() != D.b2_dynamicBody || n.IsBullet()) this.m_flags |= A.e_continuousFlag;
            this.m_fixtureA = j;
            this.m_fixtureB = o;
            this.m_manifold.m_pointCount = 0;
            this.m_nodeB.other = null
        }
    };
    A.prototype.Update = function (j) {
        var o = this.m_oldManifold;
        this.m_oldManifold = this.m_manifold;
        this.m_manifold = o;
        this.m_flags |= A.e_enabledFlag;
        var q = false;
        o = (this.m_flags & A.e_touchingFlag) == A.e_touchingFlag;
        var n = this.m_fixtureA.m_body,
            a = this.m_fixtureB.m_body,
            c = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
        if (this.m_flags & A.e_sensorFlag) {
            if (c) {
                q =
                    this.m_fixtureA.GetShape();
                c = this.m_fixtureB.GetShape();
                n = n.GetTransform();
                a = a.GetTransform();
                q = y.TestOverlap(q, n, c, a)
            }
            this.m_manifold.m_pointCount = 0
        } else {
            if (n.GetType() != D.b2_dynamicBody || n.IsBullet() || a.GetType() != D.b2_dynamicBody || a.IsBullet()) this.m_flags |= A.e_continuousFlag;
            else this.m_flags &= ~A.e_continuousFlag; if (c) {
                this.Evaluate();
                q = this.m_manifold.m_pointCount > 0;
                for (c = 0; c < this.m_manifold.m_pointCount; ++c) {
                    var g = this.m_manifold.m_points[c];
                    g.m_normalImpulse = 0;
                    g.m_tangentImpulse = 0;
                    for (var b =
                        g.m_id, e = 0; e < this.m_oldManifold.m_pointCount; ++e) {
                        var f = this.m_oldManifold.m_points[e];
                        if (f.m_id.key == b.key) {
                            g.m_normalImpulse = f.m_normalImpulse;
                            g.m_tangentImpulse = f.m_tangentImpulse;
                            break
                        }
                    }
                }
            } else this.m_manifold.m_pointCount = 0; if (q != o) {
                n.SetAwake(true);
                a.SetAwake(true)
            }
        } if (q) this.m_flags |= A.e_touchingFlag;
        else this.m_flags &= ~A.e_touchingFlag;
        this.localPoint = new N;
        this.rA = new N;
        this.rB = new N
    };
    B.b2ContactEdge = function () {};
    Q.b2ContactFactory = function () {};
    Q.prototype.b2ContactFactory = function (j) {
        this.m_allocator = j;
        this.InitializeRegisters()
    };
    Q.prototype.AddType = function (j, o, q, n) {
        if (q === undefined) q = 0;
        if (n === undefined) n = 0;
        this.m_registers[q][n].createFcn = j;
        this.m_registers[q][n].destroyFcn = o;
        this.m_registers[q][n].primary = true;
        if (q != n) {
            this.m_registers[n][q].createFcn = j;
            this.m_registers[n][q].destroyFcn = o;
            this.m_registers[n][q].primary = false
        }
    };
    Q.prototype.InitializeRegisters =
        function () {
            this.m_registers = new Vector(y.e_shapeTypeCount);
            for (var j = 0; j < y.e_shapeTypeCount; j++) {
                this.m_registers[j] = new Vector(y.e_shapeTypeCount);
                for (var o = 0; o < y.e_shapeTypeCount; o++) this.m_registers[j][o] = new V
            }
            this.AddType(w.Create, w.Destroy, y.e_circleShape, y.e_circleShape);
            this.AddType(Y.Create, Y.Destroy, y.e_polygonShape, y.e_circleShape);
            this.AddType(z.Create, z.Destroy, y.e_polygonShape, y.e_polygonShape);
            this.AddType(I.Create, I.Destroy, y.e_edgeShape, y.e_circleShape);
            this.AddType(k.Create, k.Destroy,
                y.e_polygonShape, y.e_edgeShape)
        };
    Q.prototype.Create = function (j, o) {
        var q = parseInt(j.GetType()),
            n = parseInt(o.GetType());
        q = this.m_registers[q][n];
        if (q.pool) {
            n = q.pool;
            q.pool = n.m_next;
            q.poolCount--;
            n.Reset(j, o);
            return n
        }
        n = q.createFcn;
        if (n != null) {
            if (q.primary) {
                n = n(this.m_allocator);
                n.Reset(j, o)
            } else {
                n = n(this.m_allocator);
                n.Reset(o, j)
            }
            return n
        } else return null
    };
    Q.prototype.Destroy = function (j) {
        if (j.m_manifold.m_pointCount > 0) {
            j.m_fixtureA.m_body.SetAwake(true);
            j.m_fixtureB.m_body.SetAwake(true)
        }
        var o = parseInt(j.m_fixtureA.GetType()),
            q = parseInt(j.m_fixtureB.GetType());
        o = this.m_registers[o][q];
        o.poolCount++;
        j.m_next = o.pool;
        o.pool = j;
        o = o.destroyFcn;
        o(j, this.m_allocator)
    };
    V.b2ContactRegister = function () {};
    M.b2ContactResult = function () {
        this.position = new N;
        this.normal = new N;
        this.id = new aa
    };
    L.b2ContactSolver = function () {
        this.m_step = new H;
        this.m_constraints = new Vector
    };
    L.prototype.b2ContactSolver = function () {};
    L.prototype.Initialize = function (j, o, q, n) {
        if (q === undefined) q = 0;
        var a;
        this.m_step.Set(j);
        this.m_allocator = n;
        j = 0;
        for (this.m_constraintCount =
                 q; this.m_constraints.length < this.m_constraintCount;) this.m_constraints[this.m_constraints.length] = new U;
        for (j = 0; j < q; ++j) {
            c = L.s_worldManifold.m_normal.x;
            a = L.s_worldManifold.m_normal.y;
            n = this.m_constraints[j];
            n.bodyA = e;
            n.bodyB = f;
            n.manifold = m;
            n.normal.x = c;
            n.normal.y = a;
                v = 0,
                t = 0;
            if (j.warmStarting) {
                t = q.pointCount;
                for (v = 0; v < t; ++v) {
                    var x = q.points[v];
                    x.normalImpulse *= j.dtRatio;
                    x.tangentImpulse *= j.dtRatio;
                    var C = x.normalImpulse * f + x.tangentImpulse *
                            r,
                        J = x.normalImpulse * m + x.tangentImpulse * s;
                    n.m_angularVelocity -= g * (x.rA.x * J - x.rA.y * C);
                    n.m_linearVelocity.x -= c * C;
                    n.m_linearVelocity.y -= c * J;
                    a.m_angularVelocity += e * (x.rB.x * J - x.rB.y * C);
                    a.m_linearVelocity.x += b * C;
                    a.m_linearVelocity.y += b * J
                }
            } else {
                t = q.pointCount;
                for (v = 0; v < t; ++v) {
                    n = q.points[v];
                    n.normalImpulse = 0;
                    n.tangentImpulse = 0
                }
            }
        }
    };
    L.prototype.SolveVelocityConstraints = function () {
        for (var j = 0, o, q = 0, n = 0, a = 0, c = n = n = q = q = 0, g = q = q = 0, b = q = a = 0, e = 0, f, m = 0; m < this.m_constraintCount; ++m) {
            a = this.m_constraints[m];
            var r = a.bodyA,
                s = a.bodyB,
                v = r.m_angularVelocity,
                t = s.m_angularVelocity,
                x = r.m_linearVelocity,
                C = s.m_linearVelocity,
                J = r.m_invMass,
                T = r.m_invI,
                P = s.m_invMass,
                X = s.m_invI;
            b = a.normal.x;
            var $ = e = a.normal.y;
            f = -b;
            g = a.friction;
            for (j = 0; j < a.pointCount; j++) {
                n = n > 0 ? n : 0;
                c = ca - j.velocityBias;
                f = a.K;
                n -= f.col1.x * q + f.col2.x * g;
                for (c -= f.col1.y * q + f.col2.y * g;;) {
                    f = a.normalMass;
                    $ = -(f.col1.x * n + f.col2.x * c);
                    f = -(f.col1.y * n + f.col2.y * c);
                    if ($ >= 0 && f >= 0) {
                        q = $ - q;
                        C.y += P * (q + e);
                        t += X * (o.rB.x * q - o.rB.y * a + j.rB.x * e - j.rB.y * b);
                        o.normalImpulse = $;
                        j.normalImpulse = f;
                        break
                    }
                    $ = 0;
                    f = -j.normalMass * c;
                    ba = a.K.col2.x * f + n;
                    break
                }
            }
            r.m_angularVelocity = v;
            s.m_angularVelocity = t
        }
    };
    L.prototype.FinalizeVelocityConstraints = function () {
        for (var j = 0; j < this.m_constraintCount; ++j)
        if (j === undefined) j = 0;
        for (var o = 0, q = 0; q < this.m_constraintCount; q++) {
            var n = this.m_constraints[q],
                a = n.bodyA,
                c = n.bodyB,
                g = a.m_mass * a.m_invMass,
                b = a.m_mass * a.m_invI,
                e = c.m_mass * c.m_invMass,
                f = c.m_mass * c.m_invI;
            L.s_psm.Initialize(n);
            for (var m = L.s_psm.m_normal, r = 0; r < n.pointCount; r++) {
                var s = n.points[r],
                    v = L.s_psm.m_points[r],
                    t = L.s_psm.m_separations[r],
                    x = v.x - a.m_sweep.c.x,
                    C = v.y - a.m_sweep.c.y,
                    J = v.x - c.m_sweep.c.x;
                v = v.y - c.m_sweep.c.y;
                o = o < t ? o : t;
                c.m_sweep.c.x += e * s;
                c.m_sweep.c.y += e * t;
                c.m_sweep.a += f * (J * t - v * s);
                c.SynchronizeTransform()
            }
        }
        return o > -1.5 * O.b2_linearSlop
    };
    Box2D.postDefs.push(function () {
        Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold = new l;
        Box2D.Dynamics.Contacts.b2ContactSolver.s_psm = new u
    });
    Box2D.inherit(I, Box2D.Dynamics.Contacts.b2Contact);
    I.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
    I.b2EdgeAndCircleContact = function () {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
    };
    I.Create = function () {
    };
    k.prototype.Evaluate = function () {
        var j = this.m_fixtureA.GetBody(),
            o = this.m_fixtureB.GetBody();
        this.b2CollidePolyAndEdge(this.m_manifold, this.m_fixtureA.GetShape() instanceof K ? this.m_fixtureA.GetShape() : null, j.m_xf, this.m_fixtureB.GetShape() instanceof G ? this.m_fixtureB.GetShape() : null, o.m_xf)
    };
    k.prototype.b2CollidePolyAndEdge = function () {};
    Box2D.inherit(z, Box2D.Dynamics.Contacts.b2Contact);
    z.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
    z.b2PolygonContact =
        function () {
            Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
        };
    z.Create = function () {
        return new z
    };
    z.Destroy = function () {};
    z.prototype.Reset = function (j, o) {
        this.__super.Reset.call(this, j, o)
    };
    z.prototype.Evaluate = function () {
        var j = this.m_fixtureA.GetBody(),
            o = this.m_fixtureB.GetBody();
        S.CollidePolygons(this.m_manifold, this.m_fixtureA.GetShape() instanceof K ? this.m_fixtureA.GetShape() : null, j.m_xf, this.m_fixtureB.GetShape() instanceof K ? this.m_fixtureB.GetShape() : null, o.m_xf)
    };
    u.b2PositionSolverManifold =
        function () {};
    u.prototype.b2PositionSolverManifold = function () {
        this.m_normal = new N;
        this.m_separations = new Vector_a2j_Number(O.b2_maxManifoldPoints);
        this.m_points = new Vector(O.b2_maxManifoldPoints);
        for (var j = 0; j < O.b2_maxManifoldPoints; j++) this.m_points[j] = new N
    };
    u.prototype.Initialize = function (j) {
        O.b2Assert(j.pointCount > 0);
        var o = 0,
            q = 0,
            n = 0,
            a, c = 0,
            g = 0;
        switch (j.type) {
            case Z.e_circles:
                a = j.bodyA.m_xf.R;
                n = j.localPoint;
                o = j.bodyA.m_xf.position.x + (a.col1.x * n.x + a.col2.x * n.y);
                q = j.bodyA.m_xf.position.y + (a.col1.y *
                    n.x + a.col2.y * n.y);
                a = j.bodyB.m_xf.R;
                n = j.points[0].localPoint;
            for (var M = this.m_bodyList; M; M =
                M.nextBody) {
                var L = M.body;
                if (L.IsAwake() != false) {
                    for (var I = new K, W = new K, Y = 0, k = 0, z = L.GetFixtureList(); z; z = z.GetNext()) {
                        var u = new K,
                            D = z.GetShape().ComputeSubmergedArea(this.normal, this.offset, L.GetTransform(), u);
                        Y += D;
                        I.x += D * u.x;
                        I.y += D * u.y;
                        var H = 0;
                        H = 1;
                        k += D * H;
                        W.x += D * u.x * H;
                        W.y += D * u.y * H
                    }
                    I.x /= Y;
                    I.y /= Y;
                    W.x /= k;
                    W.y /= k;
                    if (!(Y < Number.MIN_VALUE)) {
                        k = this.gravity.GetNegative();
                        k.Multiply(this.density * Y);
                        L.ApplyForce(k, W);
                        W = L.GetLinearVelocityFromWorldPoint(I);
                        W.Subtract(this.velocity);
                        W.Multiply(-this.linearDrag *
                            Y);
                        L.ApplyForce(W, I);
                        L.ApplyTorque(-L.GetInertia() / L.GetMass() * Y * L.GetAngularVelocity() * this.angularDrag)
                    }
                }
            }
        }
    };
    w.prototype.Draw = function (M) {
    }
})();
(function () {
    var F = Box2D.Common.b2Settings,
        G = Box2D.Common.Math.b2Mat22,
        K = Box2D.Common.Math.b2Mat33,
        y = Box2D.Common.Math.b2Math,
        w = Box2D.Common.Math.b2Vec2,
        A = Box2D.Common.Math.b2Vec3,
        U = Box2D.Dynamics.Joints.b2DistanceJoint,
        p = Box2D.Dynamics.Joints.b2DistanceJointDef,
        B = Box2D.Dynamics.Joints.b2FrictionJoint,
        Q = Box2D.Dynamics.Joints.b2FrictionJointDef,
        V = Box2D.Dynamics.Joints.b2GearJoint,
        M = Box2D.Dynamics.Joints.b2GearJointDef,
        L = Box2D.Dynamics.Joints.b2Jacobian,
        I = Box2D.Dynamics.Joints.b2Joint,
        W = Box2D.Dynamics.Joints.b2JointDef,
        Y = Box2D.Dynamics.Joints.b2JointEdge,
        k = Box2D.Dynamics.Joints.b2LineJoint,
        z = Box2D.Dynamics.Joints.b2LineJointDef,
        u = Box2D.Dynamics.Joints.b2MouseJoint,
        D = Box2D.Dynamics.Joints.b2MouseJointDef,
        H = Box2D.Dynamics.Joints.b2PrismaticJoint,
        O = Box2D.Dynamics.Joints.b2PrismaticJointDef,
        E = Box2D.Dynamics.Joints.b2PulleyJoint,
        R = Box2D.Dynamics.Joints.b2PulleyJointDef,
        N = Box2D.Dynamics.Joints.b2RevoluteJoint,
        S = Box2D.Dynamics.Joints.b2RevoluteJointDef,
        aa = Box2D.Dynamics.Joints.b2WeldJoint,
        Z = Box2D.Dynamics.Joints.b2WeldJointDef;
    Box2D.inherit(U, Box2D.Dynamics.Joints.b2Joint);
    U.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
    U.b2DistanceJoint = function () {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
        this.m_localAnchor1 = new w;
        this.m_localAnchor2 = new w;
            d
    };
    I.prototype.IsActive = function () {
        return this.m_bodyA.IsActive() && this.m_bodyB.IsActive()
    };
    I.Create = function (d) {
        var h = null;
        switch (d.type) {
            case I.e_distanceJoint:
                    new k(d instanceof z ? d : null);
                break;
            case I.e_weldJoint:
                h = new aa(d instanceof Z ? d : null);
                break;
            case I.e_frictionJoint:
                h = new B(d instanceof Q ? d : null)
        }
        return h
    };
    k.prototype.GetAnchorA = function () {
            e = l = 0,
            f = 0,
            m = 0,
            r = e = m = l = e = l = 0;
        if (this.m_state == I.e_atUpperLimit) {
            l =
                d.m_xf.R;
        }
        h.m_linearVelocity.SetV(c);
        h.m_angularVelocity = g;
        l.m_linearVelocity.SetV(b);
        l.m_angularVelocity = e
    };
    N.prototype.SolvePositionConstraints = function () {
        var d = 0,
            h, l = this.m_bodyA,
            j = this.m_bodyB,
            o = 0,
            q = h = 0,
            n = 0,
            a = 0;
        if (this.m_enableLimit && this.m_limitState != I.e_inactiveLimit) {
            d = j.m_sweep.a - l.m_sweep.a - this.m_referenceAngle;
            var c = 0;
            if (this.m_limitState == I.e_equalLimits) {
            } else if (this.m_limitState == I.e_atUpperLimit) {
                o = d = d - this.m_upperAngle;
                d = y.Clamp(d - F.b2_angularSlop, 0, F.b2_maxAngularCorrection);
                c = -this.m_motorMass * d
            }
            l.m_sweep.a -= l.m_invI * c;
            j.m_sweep.a += j.m_invI * c;
            l.SynchronizeTransform();
            j.SynchronizeTransform()
        }
        K.lineTo((G.position.x + this.m_xformScale * G.R.col1.x) * y, (G.position.y + this.m_xformScale * G.R.col1.y) * y);
        K.strokeStyle = this._color(65280, this.m_alpha);
        K.moveTo(G.position.x * y, G.position.y * y);
        K.lineTo((G.position.x + this.m_xformScale * G.R.col2.x) * y, (G.position.y + this.m_xformScale * G.R.col2.y) * y);
        K.closePath();
        K.stroke()
    }
})();
var i;
for (i = 0; i < Box2D.postDefs.length; ++i) Box2D.postDefs[i]();
delete Box2D.postDefs;

// Copyright 2012 the V8 project authors. All rights reserved.

// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.

function MakeNewWorld() {
    var Vec2 = Box2D.Common.Math.b2Vec2,
        BodyDef = Box2D.Dynamics.b2BodyDef,
        Body = Box2D.Dynamics.b2Body,
        FixtureDef = Box2D.Dynamics.b2FixtureDef,
        Fixture = Box2D.Dynamics.b2Fixture,
        World = Box2D.Dynamics.b2World,
        MassData = Box2D.Collision.Shapes.b2MassData,
        PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        CircleShape = Box2D.Collision.Shapes.b2CircleShape;

    var gravity = new Vec2(0, -10);
    var world = new World(gravity, true);

    var shape = new PolygonShape();
    shape.SetAsEdge(new Vec2(-40.0, 0), new Vec2(40.0, 0));

    var fd = new FixtureDef();

    var x = new Vec2(-7.0, 0.75);
    var y = new Vec2();
    var deltaX = new Vec2(0.5625, 1);
    var deltaY = new Vec2(1.125, 0.0);

    for (var i = 0; i < 2; ++i) {
        y.Set(x.x, x.y);

        for (var j = 0; j < 2; ++j) {
            var fd = new FixtureDef();
            fd.density = 5.0;
            fd.shape = shape;

            var bd = new BodyDef();
            bd.type = Body.b2_dynamicBody;
            bd.position.Set(y.x, y.y);
            var body = world.CreateBody(bd);
            body.CreateFixture(fd);
            y.Add(deltaY);
        }

        x.Add(deltaX);
    }

    return world;
}

var world = null;


function runBox2D() {
    var world = MakeNewWorld();
        world.Step(1 / 60, 10, 3);
}

function setupBox2D() {}

function tearDownBox2D() {
    world = null;
    Box2D = null;
}


runBox2D();
tearDownBox2D();

// python scripts/jalangi.py analyze -a analyses/nop/NOPEngine box2d
