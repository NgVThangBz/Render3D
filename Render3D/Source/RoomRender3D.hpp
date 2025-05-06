//
//  RoomRender3D.hpp
//  BZSketch
//
//  Created by ThangNguyen on 5/5/25.
//

#ifndef RoomRender3D_hpp
#define RoomRender3D_hpp

#include "axmol.h"
#include "extensions/axmol-ext.h"
using namespace ax;
using namespace ui;

class RoomRender3D : public Scene {
    
public:
    CREATE_FUNC(RoomRender3D);
    RoomRender3D(){};
    ~RoomRender3D(){};
    virtual bool init() override;
protected:
    void onTouchesBegan(const std::vector<ax::Touch*>& touches, ax::Event* event);
    void onTouchesMoved(const std::vector<ax::Touch*>& touches, ax::Event* event);
    void onTouchesEnded(const std::vector<ax::Touch*>& touches, ax::Event* event);
    
    void initRoomWithWall();
    void initRoomWithWall3D();
    void onMouseScroll(ax::Event* event);
    void initBox();
    void initCube();
private:
    float _angle             = 0.f;
    float _height =100;
    ax::Camera* _camera3D = nullptr;
};
#endif /* RoomRender3D_hpp */
