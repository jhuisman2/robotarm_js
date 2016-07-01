

var arm = {
  position: 0,
  level: 0,
  actions: 0,
  holding: null
}

var robot_arm = {
  speed: 0.5,
  assembly_line : {}
}

var max_duration = 2000;
var station_width = 50;
var station_count = 10;
var block_width = 40;
var block_height = 40;
var arm_height = 10;
var hand_height = 10;
var level_count = 8;
var line_position = arm_height + level_count * block_height;

var brush = "";

function draw_arm(){
	var mid = (0.5 + arm.position) * station_width;
	var left = mid - block_width / 2 - 1;
	var right = mid + block_width / 2;
	var top = arm_height + arm.level * block_height;

	draw_line(mid, 0, mid, top);
	draw_line(left, top, right, top);
  	draw_line(left, top, left, top + hand_height);
  	draw_line(right, top, right, top + hand_height);


  	if(arm.holding != null){
  		var current_color = 'white';

  		if(arm.holding == "r" || arm.holding =="red"){
  			current_color = "red";
  		} 

  		if(arm.holding == "g" || arm.holding =="green"){
  			current_color = "green";
  		} 

  		if(arm.holding == "b" || arm.holding =="blue"){
  			current_color = "blue";
  		}

  		brush = current_color;
  		//draw_rectangle(left + 1, top + 1, block_width, block_height);
  	}
}

function get_color_from_holding(){
	// fix for getting the fillcolor of an object
	return 'b';
}

function draw_line(f_horizontal_start, f_vertical_start, f_horizontal_end, f_vertical_end){
	var frame = document.getElementById("frame");
	var ctx = frame.getContext("2d");
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.strokeStyle="#000000";
	ctx.moveTo(f_horizontal_start,f_vertical_start);
	ctx.lineTo(f_horizontal_end,f_vertical_end);
	ctx.stroke();

}

function draw_rectangle(f_horizontal_start, f_vertical_start, f_width, f_height){
	var frame = document.getElementById("frame");
	var ctx = frame.getContext("2d");
	ctx.lineWidth=1;
	ctx.rect(f_horizontal_start,f_vertical_start,f_width,f_height);
	ctx.strokeStyle = "#000000";
  ctx.stroke();

	ctx.fillStyle = brush;
	ctx.fill();
}

function draw_assembly_line(){
	var frame = document.getElementById("frame");
	var ctx = frame.getContext("2d");

	for (var i = 0; i <= station_count - 1; i++) {
		var left = i * station_width;
		var right = left + station_width;

		  draw_line(left, line_position, right, line_position);
   		draw_line(left, line_position - 5, left, line_position);
    	draw_line(right, line_position - 5, right, line_position);

      robot_arm.assembly_line[i] = levels["exercise_9"][i];
    	// stack is the current table of blocks 
    	var stack = robot_arm.assembly_line[i];
    	if(stack != null){
        for (var level = 0; level <= stack.length -1  ; level++) {
          if(robot_arm.assembly_line[i][level] != null){
            console.log(robot_arm.assembly_line[i][level]);
            var current_color = 'white';

            if(robot_arm.assembly_line[i][level] == "r" || robot_arm.assembly_line[i][level] =="red"){
              current_color = "red";
            } 

            if(robot_arm.assembly_line[i][level] == "g" || robot_arm.assembly_line[i][level] =="green"){
              current_color = "green";
            } 

            if(robot_arm.assembly_line[i][level] == "b" || robot_arm.assembly_line[i][level] =="blue"){
              current_color = "blue";
            }

            brush = current_color;
          }
          draw_rectangle(left + 5, line_position - block_height * (level + 1) - (2 * (level + 1)) , block_width, block_height);
        }
    		
    	}


	}
}
/*
local function draw_assembly_line(dc)
  for i = 1, station_count do
    local left = (i - 1) * station_width
    local right = left + station_width
    
    dc:DrawLine(left, line_position, right, line_position)
    dc:DrawLine(left, line_position - 5, left, line_position)
    dc:DrawLine(right, line_position - 5, right, line_position)
    
    local stack = robot_arm.assembly_line[i]
    if type(stack) == 'table' then
      for level, block in ipairs(stack) do
        local color = wx.wxWHITE_BRUSH
        
        if block == 'r' or block == 'red' then
          color = wx.wxRED_BRUSH
        elseif block == 'g' or block == 'green' then
          color = wx.wxGREEN_BRUSH
        elseif block == 'b' or block == 'blue' then
          color = wx.wxBLUE_BRUSH
        end
        
        dc:SetBrush(color)
        dc:DrawRectangle(left + 5, line_position - block_height * level, block_width, block_height)
      end
    end
  end
end

*/

jQuery(document).ready(function(){
 arm.holding = "r";
 draw_arm();
 draw_assembly_line();

});


/* Levels */

var levels = {
  'exercise_1' : [ [], [ 'red']  ],
  'exercise_6' : [ [ 'red' ], [ 'blue' ], [ 'white' ], [ 'green' ], [ 'green' ], ['blue' ], [ 'red' ], [ 'white' ] ] ,
  'exercise_9' : [ ['blue' ], [ 'green', 'green' ], ['white', 'white', 'white' ], [ 'red', 'red', 'red', 'red' ] ],


}