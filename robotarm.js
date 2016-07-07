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

var exercise = 0;
var max_duration = 2000;
var station_width = 50;
var station_count = 10;
var block_width = 40;
var block_height = 40;
var arm_height = 10;
var hand_height = 10;
var level_count = 8;
var line_position = arm_height + level_count * block_height;
var brush = null;
var framerate = (1000 / 30); // 1000 ms = 1 sec. 30 frames a sec.
var frame = "";
var ctx = "";

function set_level(f_id){
	if(f_id < 1 || f_id > 15 || isNaN(f_id)){
		console.log("ERROR: The level has to be between 1 and 15");
	} else {
		exercise = f_id;
		for (var tempI = 0; tempI <= station_count - 1; tempI++) {
			robot_arm.assembly_line[tempI] = levels["exercise_" + exercise][tempI];	
		}
		frame = document.getElementById("frame");
		ctx = frame.getContext("2d");
		draw_arm();
 		draw_assembly_line();
	}
}

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
  		if(arm.holding != null){
  			draw_rectangle(left + 1, top + 1, block_width, block_height);
  		}
  	}
}

function draw_line(f_horizontal_start, f_vertical_start, f_horizontal_end, f_vertical_end){
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.strokeStyle="#000000";
	ctx.moveTo(f_horizontal_start,f_vertical_start);
	ctx.lineTo(f_horizontal_end,f_vertical_end);
	ctx.stroke();
}

function draw_rectangle(f_horizontal_start, f_vertical_start, f_width, f_height){
	ctx.fillStyle = brush;
    ctx.fillRect(f_horizontal_start,f_vertical_start,f_width,f_height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth   = 4;
    ctx.strokeRect(f_horizontal_start,f_vertical_start,f_width,f_height);
}

function draw_assembly_line(){

	for (var tempI = 0; tempI <= station_count - 1; tempI++) {
		var left = tempI * station_width;
		var right = left + station_width;

		draw_line(left, line_position, right, line_position);
   		draw_line(left, line_position - 5, left, line_position);
    	draw_line(right, line_position - 5, right, line_position);
    	
    	// stack is the current table of blocks 
    	var stack = robot_arm.assembly_line[tempI];

    	if(stack != null){
	        for (var level = 0; level <= stack.length -1  ; level++) {
	          
	          if(stack[level] != null){

	            
	            var current_color = 'white';

	            if(stack[level] == "r" || stack[level] =="red"){
	              current_color = "red";
	            } 

	            if(stack[level] == "g" || stack[level] =="green"){
	              current_color = "green";
	            } 

	            if(stack[level] == "b" || stack[level] =="blue"){
	              current_color = "blue";
	            }

	            brush = current_color;
	            draw_rectangle(left + 5, line_position - (block_height * (level + 1)) - (4 * (level + 1)) , block_width, block_height);	
	          }
	         	
	        }
    		
    	}


	}
}


function paint(){
	ctx.clearRect(0, 0, frame.width, frame.height);
	draw_arm();
 	draw_assembly_line();
}


function animate(start_value, end_value, duration){
	var actual_duration = duration * 0.5;

	if(typeof(robot_arm.speed) == "number"){
		actual_duration = duration * (1 - Math.floor(robot_arm.speed));
	}

	if(actual_duration < 1){
		actual_duration = 0;
	}

	// fixing corutine
	var diff = end_value - start_value;
	var counter = 0;
	var stop_watch = setInterval(function(){
		var fraction = Math.min(1, counter / actual_duration);
		while(fraction < 1){
			fraction = Math.min(1, counter / actual_duration);
			counter = counter + framerate;
		}
		clearInterval(stop_watch);
		
	}, framerate);

}

function refresh_arm(){
	var left = arm.position * station_width;
	var width = station_width;
	var top = 0;
	var height = arm_height + arm.level * block_height + hand_height;

	if(arm.holding != null){
		height = height + block_height;
	}
	paint();
}

function increase_actions(){
	arm.actions = arm.actions + 1;
}

function animate_arm(property_name, start_value, end_value, duration){
	if(robot_arm.speed >= 1){
    	arm[property_name] = end_value
    	return;
	}

	var value = animate(start_value, end_value, duration);
    refresh_arm();
  
}

function move_right(){
	if(arm.position >= station_count - 1){
		return;
	}
	animate_arm('position', arm.position, arm.position += 1, max_duration);
	increase_actions();
}

function move_left(){
	if(arm.position <= 0){
		return;
	}
	animate_arm('position', arm.position, arm.position -= 1, max_duration);
	increase_actions();
}

function grab(){
	var stack = robot_arm.assembly_line[arm.position];
	var grab_level = level_count - stack.length;

	if(stack.length == 0){
		grab_level = grab_level - 1;
	}

	if (arm.holding != null){
		grab_level = grab_level - 1;
	}

	animate_arm('level', 0, grab_level, max_duration);

	if( arm.holding == null ){
		arm.holding = stack[stack.length - 1];
		stack.splice(stack.length - 1, 1);
	}
	robot_arm.assembly_line[arm.position] = stack;
	animate_arm('level', grab_level, 0, max_duration);
  	increase_actions();

}

function scan(){
	var stack = robot_arm.assembly_line[arm.position];
	if(stack != undefined){
		var grab_level = level_count - stack.length;

		if(stack.length == 0){
			grab_level = grab_level - 1;
		}

		if (arm.holding != null){
			grab_level = grab_level - 1;
		}

		if( stack[stack.length - 1] == null || stack[stack.length - 1] == undefined){
			return 'none';
		} else {
			return stack[stack.length - 1];
		}
	} else {
		return 'none';
	}
}


function drop(){
	var stack = robot_arm.assembly_line[arm.position];
	if(stack != undefined){
		var drop_level = level_count - (stack.length - 1);	
	} else {
		var drop_level = 0;
		stack = [];
	}
	
	stack.push(arm.holding);
	robot_arm.assembly_line[arm.position] = stack;
;
	arm.holding = null;

	animate_arm('level', drop_level, 0, max_duration);
	increase_actions();
}

jQuery(document).ready(function(){
 	robot_arm_moves();
 	document.title = "RobotArm - " + arm.actions + " actions";
});


/* Levels */

var levels = {
  'exercise_1' 	: [ [], [ 'red']  ],
  'exercise_2' 	: [ [ 'blue' ], [], [], [], [ 'blue' ], [], [], [ 'blue' ] ],
  'exercise_3' 	: [ [ 'white', 'white', 'white', 'white' ] ],
  'exercise_4' 	: [ [ 'blue', 'white', 'green' ] ],
  'exercise_5' 	: [ [], [ 'red', 'red', 'red', 'red', 'red', 'red', 'red' ]],
  'exercise_6' 	: [ [ 'red' ], [ 'blue' ], [ 'white' ], [ 'green' ], [ 'green' ], ['blue' ], [ 'red' ], [ 'white' ] ] ,
  'exercise_7' 	: [ [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ] ],
  'exercise_9' 	: [ ['blue' ], [ 'green', 'green' ], ['white', 'white', 'white' ], [ 'red', 'red', 'red', 'red' ] ],
  'exercise_10' : [ [ 'green' ], [ 'blue' ], [ 'white' ], [ 'red' ], [ 'blue' ] ],
  'exercise_11' : get_generated_level(11),
  'exercise_12' : get_generated_level(12),
  'exercise_13' : get_generated_level(13),
  'exercise_14' : get_generated_level(14),
  'exercise_15' : get_generated_level(15)
    

}

levels['exercise_8'] = levels['exercise_5'];

function get_generated_level(f_id){
	var colors = ["red", "green", "white", "blue"];
	robot_arm.assembly_line ={};
	switch(f_id) {
	    case 11:
	 		for(var tempI = 2; tempI <= station_count - 1; tempI++){
				var color = colors[Math.round((Math.random() * (colors.length - 1 )) )];
				robot_arm.assembly_line[tempI] = [color ];
			}
	        break;
	    case 12:
        	for(var tempI = 1; tempI <= (station_count - 2); tempI++){
        		var color = colors[Math.round((Math.random() * (colors.length - 1 )) )];
				robot_arm.assembly_line[tempI] = [color ];
        	}
	        break;
	    case 13:
        	for(var tempI = 1; tempI <= (station_count - 1); tempI++){
        		var color = colors[Math.round((Math.random() * (colors.length - 1 )) )];
				robot_arm.assembly_line[tempI] = [color ];
        	}
	    	break;
	    case 14:
	    	for(var tempI = 2; tempI <= (station_count - 1); tempI++){
	    		robot_arm.assembly_line[tempI] = [];
	    		for(var subcounter = 1; subcounter <= (Math.floor((Math.random() * (3) + 1))) ; subcounter++){
	    			var color = colors[Math.round((Math.random() * (colors.length - 1 )) )]; 
	    			robot_arm.assembly_line[tempI].push(color);
	    		}
	    	}
	    	break;
	    case 15:
	    	colors = ["red", "green", "white", "blue", "none", "none"];
	    	for(var tempI = 1; tempI <= (station_count - 1); tempI++){
	    		var color = colors[Math.round((Math.random() * (colors.length - 1 )) )]; 
	    		if(color != "none"){
	    			robot_arm.assembly_line[tempI] = [color];
	    		}
	    	}
	    	break;
	    default:
	    	console.log("No generated level available for id " + f_id);
	    	break;
	}
	return robot_arm.assembly_line;
}
