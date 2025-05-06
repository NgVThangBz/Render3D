//
//  RoomRender3D.cpp
//  BZSketch
//
//  Created by ThangNguyen on 5/5/25.
//

#include "RoomRender3D.hpp"
#include "2d/CameraBackgroundBrush.h"
#include "3d/MeshMaterial.h"
#include "3d/MotionStreak3D.h"
#include <algorithm>
bool RoomRender3D::init(){
    if (!Scene::init())
        return false;
    
    
    Size size = Director::getInstance()->getWinSize();
    _camera3D = Camera::createPerspective(30.0f, size.width / size.height, 1.0f, 1000.0f);
    _camera3D->setPosition3D(Vec3(0.0f, _height, 100.0f));
    _camera3D->lookAt(Vec3(0.0f, 0.0f, 0.0f), Vec3(0.0f, 2.0f, 0.0f));
    _camera3D->setCameraFlag(CameraFlag::USER1);
    this->addChild(_camera3D);

    auto listener = EventListenerTouchAllAtOnce::create();
    listener->onTouchesBegan = AX_CALLBACK_2(RoomRender3D::onTouchesBegan, this);
    listener->onTouchesMoved = AX_CALLBACK_2(RoomRender3D::onTouchesMoved, this);
    listener->onTouchesEnded = AX_CALLBACK_2(RoomRender3D::onTouchesEnded, this);
    _eventDispatcher->addEventListenerWithSceneGraphPriority(listener, this);
    
    auto mouseListener = EventListenerMouse::create();
    mouseListener->onMouseScroll = AX_CALLBACK_1(RoomRender3D::onMouseScroll, this);
    _eventDispatcher->addEventListenerWithSceneGraphPriority(mouseListener, this);
    // add a point light
    auto light = PointLight::create(Vec3(35, 75, -20.5), Color3B(255, 255, 255), 150);
    addChild(light);
    // set the ambient light
    auto ambient = AmbientLight::create(Color3B(55, 55, 55));
    addChild(ambient);
    
    auto box = MeshRenderer::create("3D/box.c3t");
    box->setTexture("3D/plane.png");
    box->setPosition3D(Vec3(0, -10.0, 0));
    box->setCameraMask((unsigned short)CameraFlag::USER1);
    this->addChild(box);

    initBox();
    initCube();
    return true;
}
void RoomRender3D::initCube(){
    auto sp3d = MeshRenderer::create();
    
    int perVertexSizeInFloat = 8; // 3 pos + 3 normal + 2 UV
    
    std::vector<float> vertices = {
        // Front face (z = 1)
        -0.5f, -0.5f,  0.5f,   0, 0, 1,   0, 0,
        0.5f, -0.5f,  0.5f,   0, 0, 1,   1, 0,
        0.5f,  0.5f,  0.5f,   0, 0, 1,   1, 1,
        -0.5f,  0.5f,  0.5f,   0, 0, 1,   0, 1,
        
        // Back face (z = -1)
        -0.5f, -0.5f, -0.5f,   0, 0, -1,  1, 0,
        -0.5f,  0.5f, -0.5f,   0, 0, -1,  1, 1,
        0.5f,  0.5f, -0.5f,   0, 0, -1,  0, 1,
        0.5f, -0.5f, -0.5f,   0, 0, -1,  0, 0,
        
        // Left face (x = -1)
        -0.5f, -0.5f, -0.5f,  -1, 0, 0,   0, 0,
        -0.5f, -0.5f,  0.5f,  -1, 0, 0,   1, 0,
        -0.5f,  0.5f,  0.5f,  -1, 0, 0,   1, 1,
        -0.5f,  0.5f, -0.5f,  -1, 0, 0,   0, 1,
        
        // Right face (x = 1)
        0.5f, -0.5f, -0.5f,   1, 0, 0,   0, 0,
        0.5f,  0.5f, -0.5f,   1, 0, 0,   1, 0,
        0.5f,  0.5f,  0.5f,   1, 0, 0,   1, 1,
        0.5f, -0.5f,  0.5f,   1, 0, 0,   0, 1,
        
        // Top face (y = 1)
        -0.5f,  0.5f, -0.5f,   0, 1, 0,   0, 1,
        -0.5f,  0.5f,  0.5f,   0, 1, 0,   0, 0,
        0.5f,  0.5f,  0.5f,   0, 1, 0,   1, 0,
        0.5f,  0.5f, -0.5f,   0, 1, 0,   1, 1,
        
        // Bottom face (y = -1)
        -0.5f, -0.5f, -0.5f,   0, -1, 0,  0, 0,
        0.5f, -0.5f, -0.5f,   0, -1, 0,  1, 0,
        0.5f, -0.5f,  0.5f,   0, -1, 0,  1, 1,
        -0.5f, -0.5f,  0.5f,   0, -1, 0,  0, 1,
    };
    
    IndexArray indices(backend::IndexFormat::U_SHORT);
    std::vector<uint16_t> cubeIndices = {
        // Front
        0, 1, 2,  2, 3, 0,
        // Back
        4, 5, 6,  6, 7, 4,
        // Left
        8, 9,10, 10,11, 8,
        // Right
        12,13,14, 14,15,12,
        // Top
        16,17,18, 18,19,16,
        // Bottom
        20,21,22, 22,23,20,
    };
    
    for (auto i : cubeIndices)
        indices.emplace_back<uint16_t>(i);
    
    std::vector<MeshVertexAttrib> attribs;
    MeshVertexAttrib att;
    
    att.type = backend::VertexFormat::FLOAT3;
    att.vertexAttrib = shaderinfos::VertexKey::VERTEX_ATTRIB_POSITION;
    attribs.push_back(att);
    
    att.type = backend::VertexFormat::FLOAT3;
    att.vertexAttrib = shaderinfos::VertexKey::VERTEX_ATTRIB_NORMAL;
    attribs.push_back(att);
    
    att.type = backend::VertexFormat::FLOAT2;
    att.vertexAttrib = shaderinfos::VertexKey::VERTEX_ATTRIB_TEX_COORD;
    attribs.push_back(att);
    
    auto mat = MeshMaterial::createBuiltInMaterial(MeshMaterial::MaterialType::UNLIT, false);
    
    auto mesh = Mesh::create(vertices, perVertexSizeInFloat, indices, attribs);
    
    
    sp3d->addMesh(mesh);
    sp3d->setMaterial(mat);
    
    this->addChild(sp3d);
    
    sp3d->setPosition3D(Vec3(0, 0, 0));
    sp3d->setCameraMask((unsigned short)CameraFlag::USER1);
}
void RoomRender3D::initBox(){
    auto sp3d = MeshRenderer::create();
    
    int perVertexSizeInFloat = 8; // 3 pos + 3 normal + 2 UV

    std::vector<float> vertices = {
        0.5f, -0.5f,  0.0f,  0, -1,  0,  1.0f, 0.5f,
        0.25f, -0.5f,  0.433f, 0, -1,  0,  0.75f, 0.933f,
        -0.25f, -0.5f,  0.433f, 0, -1,  0,  0.25f, 0.933f,
        -0.5f, -0.5f,  0.0f,  0, -1,  0,  0.0f, 0.5f,
        -0.25f, -0.5f, -0.433f, 0, -1,  0,  0.25f, 0.067f,
        0.25f, -0.5f, -0.433f, 0, -1,  0,  0.75f, 0.067f,

        0.5f,  0.5f,  0.0f,  0, 1,  0,  1.0f, 0.5f,
        0.25f, 0.5f,  0.433f, 0, 1,  0,  0.75f, 0.933f,
        -0.25f, 0.5f,  0.433f, 0, 1,  0,  0.25f, 0.933f,
        -0.5f,  0.5f,  0.0f,  0, 1,  0,  0.0f, 0.5f,
        -0.25f, 0.5f, -0.433f, 0, 1,  0,  0.25f, 0.067f,
        0.25f, 0.5f, -0.433f, 0, 1,  0,  0.75f, 0.067f,
    };
    
    IndexArray indices(backend::IndexFormat::U_SHORT);
    std::vector<unsigned int> cubeIndices = {
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,

        6, 7, 8,
        6, 8, 9,
        6, 9, 10,
        6, 10, 11,

        0, 1, 7,
        0, 7, 6,

        1, 2, 8,
        1, 8, 7,

        2, 3, 9,
        2, 9, 8,

        3, 4, 10,
        3, 10, 9,

        4, 5, 11,
        4, 11, 10,

        5, 0, 6,
        5, 6, 11
    };

    for (auto i : cubeIndices)
        indices.emplace_back<uint16_t>(i);

    std::vector<MeshVertexAttrib> attribs;
    MeshVertexAttrib att;

    att.type = backend::VertexFormat::FLOAT3;
    att.vertexAttrib = shaderinfos::VertexKey::VERTEX_ATTRIB_POSITION;
    attribs.push_back(att);

    att.type = backend::VertexFormat::FLOAT3;
    att.vertexAttrib = shaderinfos::VertexKey::VERTEX_ATTRIB_NORMAL;
    attribs.push_back(att);

    att.type = backend::VertexFormat::FLOAT2;
    att.vertexAttrib = shaderinfos::VertexKey::VERTEX_ATTRIB_TEX_COORD;
    attribs.push_back(att);

    auto mat = MeshMaterial::createBuiltInMaterial(MeshMaterial::MaterialType::UNLIT, false);

    auto mesh = Mesh::create(vertices, perVertexSizeInFloat, indices, attribs);

    
    sp3d->addMesh(mesh);
    sp3d->setMaterial(mat);

    this->addChild(sp3d);

    sp3d->setPosition3D(Vec3(0, 5, 0));
    sp3d->setCameraMask((unsigned short)CameraFlag::USER1);
}

void RoomRender3D::onTouchesBegan(const std::vector<Touch*>& touches, ax::Event* event)
{
    event->stopPropagation();
}

void RoomRender3D::onTouchesMoved(const std::vector<Touch*>& touches, ax::Event* event)
{
    if (touches.size() && _camera3D)
    {
        auto touch = touches[0];
        auto delta = touch->getDelta();

        _angle -= AX_DEGREES_TO_RADIANS(delta.x);
        _camera3D->setPosition3D(Vec3(_height * sinf(_angle), _height, _height * cosf(_angle)));
        _camera3D->lookAt(Vec3(0.0f, 0.0f, 0.0f), Vec3(0.0f, 2.0f, 0.0f));

        event->stopPropagation();
    }
}

void RoomRender3D::onTouchesEnded(const std::vector<Touch*>& touches, ax::Event* event)
{
}
void RoomRender3D::onMouseScroll(ax::Event* event){
    EventMouse* e = static_cast<EventMouse*>(event);
    Point scrollPoint(e->getScrollX(), e->getScrollY());
    Point cursor(e->getLocation().x, e->getLocation().y);
    if (scrollPoint.y > 0) {
        _height = _height - 4;
    }else{
        _height = _height + 4;
    }
    _camera3D->setPosition3D(Vec3(_height * sinf(_angle), _height, _height * cosf(_angle)));
    _camera3D->lookAt(Vec3(0.0f, 0.0f, 0.0f), Vec3(0.0f, 2.0f, 0.0f));
}
