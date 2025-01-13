---
sidebar_position: 1
title: Entity Component System
---

## The Entity Compomonent System



* add short introduction to ECS

Entity is basic building block. Empty entity contains just position component and do nothing. (In the future
we will probably support entities without position component) Entity can have only one component of the same type. 
This is different to UE which allows to have multiple componets of the same type under actor. In our case we use
multiple entities and hierarchy. In our ECS entity create operation is very cheap and is desirable to destroy entites 
if they are no longer needed. In some specific cases when entity state should be preserved just destroy it's components
and recreate them if needed. For example to place item to the backpack just attach entity to backpack and destroy mesh
component. You can enumerate child entities at anytime and items doesn't have to stored in additional table array.
Another approach is to attach entity and hide mesh component and disable inputs or message callbacks.

- empty entities could be used for receiving gloabl inputs and spawning menus or control the game as gamemasters.
In our game example such entity is use to spawn debug dialog

Each entity has it's own state table. This table should contains everything needed to recreate an entity. (currect
game example is not yet done in such way but we will get there) In near future we will support saving snapshots of the game.
Snapshot could be saved at any moment. It's something like save game but more advanced it will save whole world state and
recreate it exactly which will be very helpfull for game logic/mechanics debugging.

## new

```Lua
function Entity.new(
   	name : String,
	position : vec4,
	rotation : vec4,
	parent_id : Number,
	bone_name : String) : Entity
```

### Description

Create new entity with position component

### Params

	name : name of the entity it's there mostly for debugging purpose, it doesn't have to be unique
	position : position in ENU space, z axis always points up, x axis points to north,  y axis points to east
	rotation : rotation in ENU space 
	parent_id : optional entity id of the parent, used for attaching entity to another entity
	bone_name : optional parent's bone name can be used if parent has skeleton component and entity will be attached to bone and will be automatically transformed by animations		

### Example

```Lua
local player = Entity.new(
	"Player",
	vec4(0,0,0),
	vec4(0,0,0,1),
	-1,
	"")
```
## state

```Lua    
function Entity.state(entity_id : Number) : EntityState
```

### Description

Return copy of entity's state object. Copy is returned because direct access to entity object is forbidden. Entities callbacks could be processed on different threads so the communication between entities is allowed only through messages. Accessing entity's object is allowed only on creation or in entities callback where the object is provided as self parameter. Accessing children's objects directly is not allowed too.

### Parameters

	entity_id : entity id of the entity we want to get state.

### Example

```Lua
local state = Entity.state(player_id)
print("Entity type: "..tostring(state.type))
print("Entity description: "..state.desc)
```
## destroy
```Lua
function Entity.destroy(entity_id : Number) : ()
```
### Description

Destroy entity and all it's components. Destroy itself is deferred to the end of the frame. So if you want to not render meshes for this entity you should hide its mesh etc. (TODO ? do it automatically?)

### Params

	entity_id : entity id of the entity to be destroyed
	
### Example
```Lua
Entity.destroy(item_id)
```
## attach
```Lua
function Entity:attach(parent_id : Number, bone_name : String) : ()
function Entity.attach(entity_id : Number, parent_id : Number, bone_name : String) : ()
```
### Description

Attach entity to parent entity, if entity is already attached to another entity it will be automatically detached and attached to new parent

### Params

	entity_id : entity id of the entity to be attached
	parent_id : optional entity id of the parent, used for attaching entity to another entity
	bone_name : optional parent's bone name can be used if parent has skeleton component
	
### Example
```Lua
helmet:attach(player_id, "head")
```
---
## detach
```Lua
function Entity:detach()
function Entity.detach(entity_id : Number) : ()
```
### Description

Detach entity from parent. Entity's position/rotation should be updated otherwise entity's relative position to parent will be used as world position. There is no automatic conversion because it's doesn't make sense usually entity should be thrown away or placed on ground anyway...

### Params

	entity_id : entity id of the entity to be attached
	
### Example
```Lua
	helmet:detach()
	helmet:set_transform(vec4(10,0,0), vec4(0,0,0,1))
	-- alternative to use helper function
	item_utils.throw_away(helmet._entity_id) -- expecting that entity has a rigid body
```
## register_action_callback
```Lua
function Entity:register_action_callback() -- OBSOLETE
```
### Description
Register callback where all entity's bound actions will be forwarded.

### Params

	callback : function(self: Entity, actions : [Action]) : ()

### Example
```Lua
local function player_action_callback(entity: Entity, actions: [Action]) : ()
	self._state.movement_dir = vec4(0,0,0)
			
	for i, action in ipairs(actions) do
		local movement = vec4(0,0,0)
		local pressed = action.pressed 
		local released = action.released

		if action.id == self.look_right_action_id then
			self:update_heading(action.value * game_cfg.mouse_sensitivity)
			action.processed = false
		elseif action.id == self.look_up_action_id then
			action.processed = false
		elseif action.id == self.forward_action_id then
			movement = vec4(action.value, 0)
			action.processed = true
		elseif action.id == self.backward_action_id then
			movement = vec4(-action.value, 0)
			action.processed = true
		elseif action.id == self.right_action_id then
			movement = vec4(0, action.value)
			action.processed = true
		elseif action.id == self.left_action_id then
			movement = vec4(0, -action.value)
			action.processed = true
		end
    end
end
	
player:register_action_callback(player_action_callback)
```
## register_message_callback
```Lua
function Entity:register_message_callback(message_id : Number, callback : function(self: Entity, msg: Any) : ())
```
### Description
	

### Params

	message_id : simple integer message id
	callback : function(self: Entity, msg : Any) : ()

### Example
```Lua
local function drawer_open_close(entity: Entity, msg: Any) : ()
	local impulse_direction = entity:get_constraint_current_position() > 0.05 and -1 or 1
	entity:add_impulse(
		10.0 * (awmath.quat_mul_vec(entity:rotation(), vec4(1.0, 0.0, 0.0))) * impulse_direction,
		vec4(0.0, 0.0, 0.0))
end
	
drawer:register_message_callback2(
	game_cfg.Messages.Use,
	drawer_open_close)
```
## register_heartbeat_callback
## create_camera
```Lua
function Entity:create_camera(callback : function(self: Entity, pos: vec4, rot: vec4, dt: number) : (vec4, vec4, number))
```
### Description
Create camera component on entity.

### Params

	callback : function(self: Entity, pos: vec4, rot: vec4, dt: number) : (vec4, vec4, number)

### Example
```Lua
local function car_camera_callback(
	self: Entity,
	pos: vec4,
	rot: vec4,
	dt: number) : (vec4, vec4, number)
	return pos, rot, 0;
end

local camera = Entity.new(
	"camera",
	pos,
	rot,
	parent_id,
	bone_name)

camera:create_camera(car_camera_callback)
```
## possess
## unpossess
## get_possessed_id
```Lua
function Entity.get_possessed_id() : Number
```
### Description
Return entity id of possessed entity. If there is none entity possessed return -1.

```Lua
local possessed_id = Entity.get_possessed_id()

if possesed_id ~= -1 then
	print("Possessed Entity ID: "..tostring(possessed_id))
else
	print("There is no possessed entity!")
end
```
## bind_action
## unbind_action
## unbind_all_actions
## set_visibility
## camera_recompute
## create_rigid_body
```Lua
eng.RigidBodyType = {
	Static = 0,
	Kinematic = 1,
	Dynamic = 2,
}

RigidBodyDesc = {
{
	type = eng.RigidBodyType.Static,
	material = "default", -- not used for now
	mass = 0.0, -- 0.0 means mass is computed automatically
	friction = 0.2,
	restitution = 0.1,
	inertia = vec4(1,1,1),
	linear_damping = 0.05,
	angular_damping = 0.05,
	gravity_factor = 1.0,
	linear_velocity = vec4(0,0,0),
	linear_impulse = vec4(0,0,0),
	angular_velocity = vec4(0,0,0),
	angular_impulse = vec4(0,0,0),
    inertia_tensor_scale = vec4(1,1,1),
    center_of_mass = vec4(0,0,0),
	apply_gyroscopic_force = false,
    is_sensor = false,
},

function Entity:create_rigid_body(desc : RigidBodyDesc, shapes : [ShapeDesc]) : ()
```
### Description
Create physical rigid body representation of entity.

### Params
	desc : Rigid body description
    shapes : shapes descriptions, if shapes are not provided shapes from model will be used if available otherwise simple sphere with R=0.05m will be created and warning will be written to log 

### Example
```Lua
local item: Entity = Entity.new(
	"item",
    vec4(6, 1, 0.5),
    vec4(0, 0, 0, 1))
item:create_rigid_body(
	{
		type = eng.RigidBodyType.Dynamic,
		material = "default",
		mass = 200.0,
		friction = 1.0,
		restitution = 0.0,
		linear_damping = 0.5,
		angular_damping = 0.5,
	},
	{
		{
			pos = vec4(0.0, 0.0, 0.0),
			rot = vec4(0,0,0,1),
			type = eng.ShapeType.Box,
			hx = 0.3,
			hy = 0.3,
			hz = 0.5,
		}
	});
```

## destroy_rigid_body
## create_rigid_body_constraints
## get_constraint_current_position
## get_rigid_body_com_position_local
```Lua
function Entity:get_rigid_body_com_position_local() : ()
```
### Description

Return center of mass position in rigid body's local space coordinates
	
### Params

### Example
```Lua
local com = door:get_rigid_body_com_position_local()
```
## get_aabb
## add_impulse
## add_force
## add_torque
## add_force_and_torque
## create_character
## activate_character
## destroy_character
## create_ai_character
## create_vehicle
## set_character_movement
```Lua
self:set_character_movement(movement);
```
### Description

Set character component movement velocity vector. Velocity vector is persistent so another call with zero velocity vector is needed to make character to stop.
	
### Params
	movement : movement velocity vector

### Example
```Lua
function player_heartbeat(self: Entity, dt: number)
	local movement_dir = vec4(1,1,0)
	local movement_len = simd.length(movement_dir)
	local movement = vec4(0,0,0)
    local movement_speed = 5.0

	if movement_len.x > 0.00001 then
		movement = movement_dir * (movement_speed / movement_len)
	end
    
	self:set_character_movement(movement)
end
```
## update_heading
## set_camera_offset
## position
## set_position
## rotation
## set_rotation
## set_transform
## frame_counter
## send_message
## create_transform_processor
## create_skeleton
## get_joint_transform
## create_model
## create_model_static
## create_blend_graph_1d
## create_aimoffset_graph_1d
## create_additive_graph
## create_blend_explicit_graph
## set_blend_graph_param
## add_additive_animation
## reset_additive_animation
## enable_inputs
## disable_inputs
## get_world_transform
## get_children
```Lua
function Entity:get_children() : [EntityIDs]
function ENtity.get_childrem(entity_id : Number) : [EntityIDs]
```
### Description

Return all children entity IDs.

*TODO add a number to limit hierarchy level...

### Params
	
    entity_id : entity id of the entity to get hierarchy from 

### Example
```Lua
local all_children = backpack:get_hierarchy()
```
## create_effect
## name
```Lua
function Entity:name() : string
function ENtity.name(entity_id : Number) : string
```
### Description

Return entity's name.

### Params
	
    entity_id : Entity ID

### Example
```Lua
local name = item:name()

print("Entity name: "..name)
```
## enable_global_inputs
```Lua
function Entity:enable_global_inputs() : ()
```
### Description

Enable global inputs, entity will receive input even if it is not possessed.

### Params
	

### Example
```Lua
main_menu:enable_global_inputs()

```
## disable_global_inputs
```Lua
function Entity:disable_global_inputs() : ()
```
### Description

Disable global inputs. To not receive inputs you have to call disable_inputs in case entity is possessed.

### Params
	

### Example
```Lua
main_menu:disable_global_inputs()

```
## Engine 
```Lua
	eng.RigidBodyType.Static
	eng.RigidBodyType.Kinematic
	eng.RigidBodyType.Dynamic
```
```Lua
	eng.ShapeType.Sphere
	eng.ShapeType.Box
	eng.ShapeType.Cylinder
	eng.ShapeType.Capsule
```
```Lua
	eng.ConstraintType.Fixed
	eng.ConstraintType.Hinge
	eng.ConstraintType.Slider
```
## set_ref_position_ecef
## console_command
## ecef2enu
## get_physics_debug_config
## set_physics_debug_config
## get_render_debug_config
## set_render_debug_config
## draw_line
## get_environment
## set_environment
## screen_to_world
## world_to_screen
```Lua
function eng.world_to_screen(pos : vector) : vector
```

### Description
Return screen position of provided position.

### Params

	pos : position in world coordinates

### Example
```Lua
local pos, rot = item.get_world_transform(item_id)
local screen_pos = eng.world_to_screen(pos)

imgui.PushDefaultFont()
local drawList = imgui.GetForegroundDrawList()

imgui.AddText(draw_list, screen_pos, 0xffffffff, "Some info about the Item!")
```
## cast_ray
```Lua
function eng.cast_ray(pos : vector, dir : vector) : (number, vector)
```

### Description
Return world position of impact point and entity id.

### Params

	pos : position in world coordinates
	dir : direction of the ray, distance has to baked to direction length

### Example
```Lua
local entity_id, impact_pos = eng.cast_ray(pos, dir * ray_length)

if entity_id ~= 0 then
	print("Entity "..tostring(entity_id).." was hit by ray!")
end
```
## cast_ray_and_get_normal
```Lua
function eng.cast_ray_and_get_normal(pos : vector, dir : vector) : (number, vector, vector)
```

### Description
Return world position of impact point shape normal at impact point and entity id.

### Params

	pos : position in world coordinates
	dir : direction of the ray, distance has to baked to direction length

### Example
```Lua
local entity_id, impact_pos, normal = eng.cast_ray_and_get_normal(pos, dir * ray_length)

if entity_id ~= 0 then
	eng.draw_line(
    	0xffffffff,
        {
        	impact_pos,
            impact_pos + normal,
        },
        1)
end
```
## set_camera_active
```Lua
	function eng.set_camera_active(camera_id : Number)
```
### Description
Set active camera.
### Params
	camera_id : Entity ID of the camera
### Example
```Lua
	local camera_id = fps_camera.create(
		vec4(0, 0, 0),
		vec4(0, 0, 0, 1),
		player._entity_id,
		"fps_camera")

	eng.set_camera_active(camera_id)
```
# Asset
```Lua
return {
	type = game_cfg.ItemType.Food,
	constructor = function(
		pos : vec4,
		rot : vec4,
		parent_id : Number,
		bone_name : String,
		params : Any) : Number,
	desc = "Item description",
	... 
	game specific stuff	
}
```
---
## create_asset
```Lua
function create_asset(
	url : String,
	position : vec4,
	rotation : vec4,
	parent_id : Number,
	bone_name : String);
```        
---




