function robot_arm_moves(){
	set_level(6);


	for(var x = 1; x <= 9; x++){
		if(scan() == "blue"){
			grab();
			for(var y = 1; y <= (10 - x); y++){
				move_right();
			}
			drop();
			for(var y = 1; y <= (9 - x); y++){
				move_left();
			}
		} else {
			move_right();
		}
	}
}