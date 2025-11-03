; HEADER_BLOCK_START
; BambuStudio 02.03.01.51
; model printing time: 4m 48s; total estimated time: 11m 36s
; total layer number: 50
; total filament length [mm] : 325.49
; total filament volume [cm^3] : 782.89
; total filament weight [g] : 0.00
; filament_density: 0
; filament_diameter: 1.75
; max_z_height: 10.00
; filament: 1
; HEADER_BLOCK_END

; CONFIG_BLOCK_START
; accel_to_decel_enable = 0
; accel_to_decel_factor = 50%
; activate_air_filtration = 0
; additional_cooling_fan_speed = 0
; apply_scarf_seam_on_circles = 1
; apply_top_surface_compensation = 0
; auxiliary_fan = 0
; avoid_crossing_wall_includes_support = 0
; bed_custom_model = 
; bed_custom_texture = 
; bed_exclude_area = 0x0,18x0,18x28,0x28
; bed_temperature_formula = by_first_filament
; before_layer_change_gcode = 
; best_object_pos = 0.5,0.5
; bottom_color_penetration_layers = 3
; bottom_shell_layers = 3
; bottom_shell_thickness = 0
; bottom_surface_pattern = zig-zag
; bridge_angle = 0
; bridge_flow = 1
; bridge_no_support = 0
; bridge_speed = 50
; brim_object_gap = 0
; brim_type = auto_brim
; brim_width = 0
; chamber_temperatures = 0
; change_filament_gcode = ;=X1 20250822=\nM620 S[next_extruder]A\nM204 S9000\nG1 Z{max_layer_z + 3.0} F1200\n\nG1 X70 F21000\nG1 Y245\nG1 Y265 F3000\nM400\nM106 P1 S0\nM106 P2 S0\n{if nozzle_temperature[previous_extruder] > 142 && next_extruder < 255}\nM104 S{nozzle_temperature[previous_extruder]}\n{endif}\n{if long_retractions_when_cut[previous_extruder]}\nM620.11 S1 I[previous_extruder] E-{retraction_distances_when_cut[previous_extruder]} F{flush_volumetric_speeds[previous_extruder]/2.4053*60}\n{else}\nM620.11 S0\n{endif}\nM400\nG1 X90 F3000\nG1 Y255 F4000\nG1 X100 F5000\nG1 X120 F15000\nG1 X20 Y50 F21000\nG1 Y-3\n{if toolchange_count == 2}\n; get travel path for change filament\nM620.1 X[travel_point_1_x] Y[travel_point_1_y] F21000 P0\nM620.1 X[travel_point_2_x] Y[travel_point_2_y] F21000 P1\nM620.1 X[travel_point_3_x] Y[travel_point_3_y] F21000 P2\n{endif}\nM620.1 E F{flush_volumetric_speeds[previous_extruder]/2.4053*60} T{flush_temperatures[previous_extruder]}\nT[next_extruder]\nM620.1 E F{flush_volumetric_speeds[next_extruder]/2.4053*60} T{flush_temperatures[next_extruder]}\n\n{if next_extruder < 255}\n{if long_retractions_when_cut[previous_extruder]}\nM620.11 S1 I[previous_extruder] E{retraction_distances_when_cut[previous_extruder]} F{flush_volumetric_speeds[previous_extruder]/2.4053*60}\nM628 S1\nG92 E0\nG1 E{retraction_distances_when_cut[previous_extruder]} F{flush_volumetric_speeds[previous_extruder]/2.4053*60}\nM400\nM629 S1\n{else}\nM620.11 S0\n{endif}\nG92 E0\n{if flush_length_1 > 1}\nM83\n; FLUSH_START\n; always use highest temperature to flush\nM400\n{if filament_type[next_extruder] == "PETG"}\nM109 S260\n{elsif filament_type[next_extruder] == "PVA"}\nM109 S210\n{else}\nM109 S{flush_temperatures[next_extruder]}\n{endif}\n{if flush_length_1 > 23.7}\nG1 E23.7 F{flush_volumetric_speeds[previous_extruder]/2.4053*60} ; do not need pulsatile flushing for start part\nG1 E{(flush_length_1 - 23.7) * 0.02} F50\nG1 E{(flush_length_1 - 23.7) * 0.23} F{flush_volumetric_speeds[previous_extruder]/2.4053*60}\nG1 E{(flush_length_1 - 23.7) * 0.02} F50\nG1 E{(flush_length_1 - 23.7) * 0.23} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{(flush_length_1 - 23.7) * 0.02} F50\nG1 E{(flush_length_1 - 23.7) * 0.23} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{(flush_length_1 - 23.7) * 0.02} F50\nG1 E{(flush_length_1 - 23.7) * 0.23} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\n{else}\nG1 E{flush_length_1} F{flush_volumetric_speeds[previous_extruder]/2.4053*60}\n{endif}\n; FLUSH_END\nG1 E-[old_retract_length_toolchange] F1800\nG1 E[old_retract_length_toolchange] F300\n{endif}\n\n{if flush_length_2 > 1}\n\nG91\nG1 X3 F12000; move aside to extrude\nG90\nM83\n\n; FLUSH_START\nG1 E{flush_length_2 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_2 * 0.02} F50\nG1 E{flush_length_2 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_2 * 0.02} F50\nG1 E{flush_length_2 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_2 * 0.02} F50\nG1 E{flush_length_2 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_2 * 0.02} F50\nG1 E{flush_length_2 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_2 * 0.02} F50\n; FLUSH_END\nG1 E-[new_retract_length_toolchange] F1800\nG1 E[new_retract_length_toolchange] F300\n{endif}\n\n{if flush_length_3 > 1}\n\nG91\nG1 X3 F12000; move aside to extrude\nG90\nM83\n\n; FLUSH_START\nG1 E{flush_length_3 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_3 * 0.02} F50\nG1 E{flush_length_3 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_3 * 0.02} F50\nG1 E{flush_length_3 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_3 * 0.02} F50\nG1 E{flush_length_3 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_3 * 0.02} F50\nG1 E{flush_length_3 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_3 * 0.02} F50\n; FLUSH_END\nG1 E-[new_retract_length_toolchange] F1800\nG1 E[new_retract_length_toolchange] F300\n{endif}\n\n{if flush_length_4 > 1}\n\nG91\nG1 X3 F12000; move aside to extrude\nG90\nM83\n\n; FLUSH_START\nG1 E{flush_length_4 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_4 * 0.02} F50\nG1 E{flush_length_4 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_4 * 0.02} F50\nG1 E{flush_length_4 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_4 * 0.02} F50\nG1 E{flush_length_4 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_4 * 0.02} F50\nG1 E{flush_length_4 * 0.18} F{flush_volumetric_speeds[next_extruder]/2.4053*60}\nG1 E{flush_length_4 * 0.02} F50\n; FLUSH_END\n{endif}\n; FLUSH_START\nM400\nM109 S{nozzle_temperature[next_extruder]}\nG1 E2 F{flush_volumetric_speeds[next_extruder]/2.4053*60} ;Compensate for filament spillage during waiting temperature\n; FLUSH_END\nM400\nG92 E0\nG1 E-[new_retract_length_toolchange] F1800\nM106 P1 S255\nM400 S3\n\nG1 X70 F5000\nG1 X90 F3000\nG1 Y255 F4000\nG1 X105 F5000\nG1 Y265 F5000\nG1 X70 F10000\nG1 X100 F5000\nG1 X70 F10000\nG1 X100 F5000\n\nG1 X70 F10000\nG1 X80 F15000\nG1 X60\nG1 X80\nG1 X60\nG1 X80 ; shake to put down garbage\nG1 X100 F5000\nG1 X165 F15000; wipe and shake\nG1 Y256 ; move Y to aside, prevent collision\nM400\nG1 Z{max_layer_z + 3.0} F3000\n{if layer_z <= (initial_layer_print_height + 0.001)}\nM204 S[initial_layer_acceleration]\n{else}\nM204 S[default_acceleration]\n{endif}\n{else}\nG1 X[x_after_toolchange] Y[y_after_toolchange] Z[z_after_toolchange] F12000\n{endif}\nM621 S[next_extruder]A\n
; circle_compensation_manual_offset = 0
; circle_compensation_speed = 200
; close_fan_the_first_x_layers = 1
; complete_print_exhaust_fan_speed = 80
; cool_plate_temp = 35
; cool_plate_temp_initial_layer = 35
; counter_coef_1 = 0
; counter_coef_2 = 0.025
; counter_coef_3 = -0.11
; counter_limit_max = 0.05
; counter_limit_min = -0.04
; curr_bed_type = Cool Plate
; default_acceleration = 10000
; default_filament_colour = ""
; default_jerk = 0
; default_print_profile = 0.20mm Standard @BBL X1C
; deretraction_speed = 30
; detect_floating_vertical_shell = 1
; detect_narrow_internal_solid_infill = 1
; detect_overhang_wall = 1
; detect_thin_wall = 0
; diameter_limit = 50
; different_settings_to_system = ;;
; draft_shield = disabled
; during_print_exhaust_fan_speed = 60
; elefant_foot_compensation = 0
; enable_arc_fitting = 0
; enable_circle_compensation = 0
; enable_height_slowdown = 0
; enable_long_retraction_when_cut = 2
; enable_overhang_bridge_fan = 1
; enable_overhang_speed = 1
; enable_pre_heating = 0
; enable_pressure_advance = 0
; enable_prime_tower = 0
; enable_support = 0
; enable_wrapping_detection = 0
; enforce_support_layers = 0
; eng_plate_temp = 45
; eng_plate_temp_initial_layer = 45
; ensure_vertical_shell_thickness = enabled
; exclude_object = 1
; extruder_ams_count = 
; extruder_clearance_dist_to_rod = 40
; extruder_clearance_height_to_lid = 120
; extruder_clearance_height_to_rod = 40
; extruder_clearance_max_radius = 68
; extruder_colour = ""
; extruder_offset = 0x2
; extruder_printable_area = 
; extruder_printable_height = 0
; extruder_type = Direct Drive
; extruder_variant_list = "Direct Drive Standard,Direct Drive High Flow"
; fan_cooling_layer_time = 60
; fan_direction = left
; fan_max_speed = 100
; fan_min_speed = 20
; filament_adaptive_volumetric_speed = 0
; filament_adhesiveness_category = 0
; filament_change_length = 10
; filament_colour = #00AE42
; filament_cost = 0
; filament_density = 0
; filament_diameter = 1.75
; filament_end_gcode = " "
; filament_extruder_variant = "Direct Drive Standard"
; filament_flow_ratio = 0.98
; filament_flush_temp = 0
; filament_flush_volumetric_speed = 0
; filament_ids = ""
; filament_is_support = 0
; filament_long_retractions_when_cut = 1
; filament_map = 1
; filament_map_mode = Auto For Flush
; filament_max_volumetric_speed = 21
; filament_minimal_purge_on_wipe_tower = 15
; filament_notes = 
; filament_pre_cooling_temperature = 0
; filament_prime_volume = 45
; filament_printable = 3
; filament_ramming_travel_time = 0
; filament_ramming_volumetric_speed = -1
; filament_retraction_distances_when_cut = 18
; filament_scarf_gap = 0
; filament_scarf_height = 10%
; filament_scarf_length = 10
; filament_scarf_seam_type = none
; filament_self_index = 1,1
; filament_settings_id = "Bambu PLA Basic @BBL X1C"
; filament_shrink = 100%
; filament_soluble = 0
; filament_start_gcode = "; filament start gcode\n{if  (bed_temperature[current_extruder] >55)||(bed_temperature_initial_layer[current_extruder] >55)}M106 P3 S200\n{elsif(bed_temperature[current_extruder] >50)||(bed_temperature_initial_layer[current_extruder] >50)}M106 P3 S150\n{elsif(bed_temperature[current_extruder] >45)||(bed_temperature_initial_layer[current_extruder] >45)}M106 P3 S50\n{endif}\nM142 P1 R35 S40\n{if activate_air_filtration[current_extruder] && support_air_filtration}\nM106 P3 S{during_print_exhaust_fan_speed_num[current_extruder]} \n{endif}"
; filament_type = PLA
; filament_velocity_adaptation_factor = 1
; filament_vendor = (Undefined)
; filename_format = [input_filename_base].gcode
; filter_out_gap_fill = 0
; first_layer_print_sequence = 0
; first_x_layer_fan_speed = 0
; flush_into_infill = 0
; flush_into_objects = 0
; flush_into_support = 1
; flush_multiplier = 1
; flush_volumes_matrix = 0,280,280,280,280,0,280,280,280,280,0,280,280,280,280,0
; flush_volumes_vector = 140,140,140,140,140,140,140,140
; full_fan_speed_layer = 0
; fuzzy_skin = none
; fuzzy_skin_point_distance = 0.8
; fuzzy_skin_thickness = 0.3
; gap_infill_speed = 250
; gcode_add_line_number = 0
; gcode_flavor = marlin
; grab_length = 0
; has_scarf_joint_seam = 0
; head_wrap_detect_zone = 
; hole_coef_1 = 0
; hole_coef_2 = -0.025
; hole_coef_3 = 0.28
; hole_limit_max = 0.25
; hole_limit_min = 0.08
; hot_plate_temp = 45
; hot_plate_temp_initial_layer = 45
; hotend_cooling_rate = 2
; hotend_heating_rate = 2
; impact_strength_z = 0
; independent_support_layer_height = 1
; infill_combination = 0
; infill_direction = 45
; infill_jerk = 9
; infill_lock_depth = 1
; infill_rotate_step = 0
; infill_shift_step = 0.4
; infill_wall_overlap = 15%
; inherits_group = ;;
; initial_layer_acceleration = 500
; initial_layer_flow_ratio = 1
; initial_layer_infill_speed = 105
; initial_layer_jerk = 9
; initial_layer_line_width = 0.4
; initial_layer_print_height = 0.2
; initial_layer_speed = 50
; initial_layer_travel_acceleration = 6000
; inner_wall_acceleration = 0
; inner_wall_jerk = 9
; inner_wall_line_width = 0.4
; inner_wall_speed = 300
; interface_shells = 0
; interlocking_beam = 0
; interlocking_beam_layer_count = 2
; interlocking_beam_width = 0.8
; interlocking_boundary_avoidance = 2
; interlocking_depth = 2
; interlocking_orientation = 22.5
; internal_bridge_support_thickness = 0
; internal_solid_infill_line_width = 0.4
; internal_solid_infill_pattern = zig-zag
; internal_solid_infill_speed = 250
; ironing_direction = 45
; ironing_flow = 10%
; ironing_inset = 0
; ironing_pattern = zig-zag
; ironing_spacing = 0.1
; ironing_speed = 20
; ironing_type = no ironing
; is_infill_first = 0
; layer_change_gcode = 
; layer_height = 0.2
; line_width = 0.4
; locked_skeleton_infill_pattern = zigzag
; locked_skin_infill_pattern = crosszag
; long_retractions_when_cut = 0
; long_retractions_when_ec = 0
; machine_end_gcode = ;===== date: 20240528 =====================\nM400 ; wait for buffer to clear\nG92 E0 ; zero the extruder\nG1 E-0.8 F1800 ; retract\nG1 Z{max_layer_z + 0.5} F900 ; lower z a little\nG1 X65 Y245 F12000 ; move to safe pos\nG1 Y265 F3000\n\nG1 X65 Y245 F12000\nG1 Y265 F3000\nM140 S0 ; turn off bed\nM106 S0 ; turn off fan\nM106 P2 S0 ; turn off remote part cooling fan\nM106 P3 S0 ; turn off chamber cooling fan\n\nG1 X100 F12000 ; wipe\n; pull back filament to AMS\nM620 S255\nG1 X20 Y50 F12000\nG1 Y-3\nT255\nG1 X65 F12000\nG1 Y265\nG1 X100 F12000 ; wipe\nM621 S255\nM104 S0 ; turn off hotend\n\nM622.1 S1 ; for prev firmware, default turned on\nM1002 judge_flag timelapse_record_flag\nM622 J1\n    M400 ; wait all motion done\n    M991 S0 P-1 ;end smooth timelapse at safe pos\n    M400 S3 ;wait for last picture to be taken\nM623; end of "timelapse_record_flag"\n\nM400 ; wait all motion done\nM17 S\nM17 Z0.4 ; lower z motor current to reduce impact if there is something in the bottom\n{if (max_layer_z + 100.0) < 250}\n    G1 Z{max_layer_z + 100.0} F600\n    G1 Z{max_layer_z +98.0}\n{else}\n    G1 Z250 F600\n    G1 Z248\n{endif}\nM400 P100\nM17 R ; restore z current\n\nM220 S100  ; Reset feedrate magnitude\nM201.2 K1.0 ; Reset acc magnitude\nM73.2   R1.0 ;Reset left time magnitude\nM1002 set_gcode_claim_speed_level : 0\n;=====printer finish  sound=========\nM17\nM400 S1\nM1006 S1\nM1006 A0 B20 L100 C37 D20 M40 E42 F20 N60\nM1006 A0 B10 L100 C44 D10 M60 E44 F10 N60\nM1006 A0 B10 L100 C46 D10 M80 E46 F10 N80\nM1006 A44 B20 L100 C39 D20 M60 E48 F20 N60\nM1006 A0 B10 L100 C44 D10 M60 E44 F10 N60\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N60\nM1006 A0 B10 L100 C39 D10 M60 E39 F10 N60\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N60\nM1006 A0 B10 L100 C44 D10 M60 E44 F10 N60\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N60\nM1006 A0 B10 L100 C39 D10 M60 E39 F10 N60\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N60\nM1006 A0 B10 L100 C48 D10 M60 E44 F10 N100\nM1006 A0 B10 L100 C0 D10 M60 E0 F10  N100\nM1006 A49 B20 L100 C44 D20 M100 E41 F20 N100\nM1006 A0 B20 L100 C0 D20 M60 E0 F20 N100\nM1006 A0 B20 L100 C37 D20 M30 E37 F20 N60\nM1006 W\n\nM17 X0.8 Y0.8 Z0.5 ; lower motor current to 45% power\nM960 S5 P0 ; turn off logo lamp\n
; machine_load_filament_time = 0
; machine_max_acceleration_e = 5000,5000
; machine_max_acceleration_extruding = 20000,20000
; machine_max_acceleration_retracting = 5000,5000
; machine_max_acceleration_travel = 9000,9000
; machine_max_acceleration_x = 20000,20000
; machine_max_acceleration_y = 20000,20000
; machine_max_acceleration_z = 500,200
; machine_max_jerk_e = 2.5,2.5
; machine_max_jerk_x = 9,9
; machine_max_jerk_y = 9,9
; machine_max_jerk_z = 3,3
; machine_max_speed_e = 30,30
; machine_max_speed_x = 500,200
; machine_max_speed_y = 500,200
; machine_max_speed_z = 20,20
; machine_min_extruding_rate = 0
; machine_min_travel_rate = 0
; machine_pause_gcode = 
; machine_prepare_compensation_time = 260
; machine_start_gcode = ;===== machine: X1-0.4 ====================\n;===== date: 20250909 ==================\n;===== start printer sound ================\nM17\nM400 S1\nM1006 S1\nM1006 A0 B10 L100 C37 D10 M60 E37 F10 N60\nM1006 A0 B10 L100 C41 D10 M60 E41 F10 N60\nM1006 A0 B10 L100 C44 D10 M60 E44 F10 N60\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N60\nM1006 A46 B10 L100 C43 D10 M70 E39 F10 N100\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N100\nM1006 A43 B10 L100 C0 D10 M60 E39 F10 N100\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N100\nM1006 A41 B10 L100 C0 D10 M100 E41 F10 N100\nM1006 A44 B10 L100 C0 D10 M100 E44 F10 N100\nM1006 A49 B10 L100 C0 D10 M100 E49 F10 N100\nM1006 A0 B10 L100 C0 D10 M100 E0 F10 N100\nM1006 A48 B10 L100 C44 D10 M60 E39 F10 N100\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N100\nM1006 A44 B10 L100 C0 D10 M90 E39 F10 N100\nM1006 A0 B10 L100 C0 D10 M60 E0 F10 N100\nM1006 A46 B10 L100 C43 D10 M60 E39 F10 N100\nM1006 W\n;===== turn on the HB fan =================\nM104 S75 ;set extruder temp to turn on the HB fan and prevent filament oozing from nozzle\n;===== reset machine status =================\nM290 X40 Y40 Z2.6666666\nG91\nM17 Z0.4 ; lower the z-motor current\nG380 S2 Z30 F300 ; G380 is same as G38; lower the hotbed , to prevent the nozzle is below the hotbed\nG380 S2 Z-25 F300 ;\nG1 Z5 F300;\nG90\nM17 X1.2 Y1.2 Z0.75 ; reset motor current to default\nM960 S5 P1 ; turn on logo lamp\nG90\nM220 S100 ;Reset Feedrate\nM221 S100 ;Reset Flowrate\nM73.2   R1.0 ;Reset left time magnitude\nM1002 set_gcode_claim_speed_level : 5\nM221 X0 Y0 Z0 ; turn off soft endstop to prevent protential logic problem\nG29.1 Z{+0.0} ; clear z-trim value first\nM204 S10000 ; init ACC set to 10m/s^2\n\n;===== heatbed preheat ====================\nM1002 gcode_claim_action : 2\nM140 S[bed_temperature_initial_layer_single] ;set bed temp\nM190 S[bed_temperature_initial_layer_single] ;wait for bed temp\n\n{if scan_first_layer}\n;=========register first layer scan=====\nM977 S1 P60\n{endif}\n\n;=============turn on fans to prevent PLA jamming=================\n{if filament_type[initial_no_support_extruder]=="PLA"}\n    {if (bed_temperature[initial_no_support_extruder] >45)||(bed_temperature_initial_layer[initial_no_support_extruder] >45)}\n    M106 P3 S180\n    {endif};Prevent PLA from jamming\n    M142 P1 R35 S40\n{endif}\nM106 P2 S100 ; turn on big fan ,to cool down toolhead\n\n;===== prepare print temperature and material ==========\nM104 S[nozzle_temperature_initial_layer] ;set extruder temp\nG91\nG0 Z10 F1200\nG90\nG28 X\nM975 S1 ; turn on\nG1 X60 F12000\nG1 Y245\nG1 Y265 F3000\nM620 M\nM620 S[initial_no_support_extruder]A   ; switch material if AMS exist\n    M109 S[nozzle_temperature_initial_layer]\n    G1 X120 F12000\n\n    G1 X20 Y50 F12000\n    G1 Y-3\n    T[initial_no_support_extruder]\n    G1 X54 F12000\n    G1 Y265\n    M400\nM621 S[initial_no_support_extruder]A\nM620.1 E F{flush_volumetric_speeds[initial_no_support_extruder]/2.4053*60} T{flush_temperatures[initial_no_support_extruder]}\n\nM412 S1 ; ===turn on filament runout detection===\n\nM109 S250 ;set nozzle to common flush temp\nM106 P1 S0\nG92 E0\nG1 E50 F200\nM400\nM104 S[nozzle_temperature_initial_layer]\nG92 E0\nG1 E50 F200\nM400\nM106 P1 S255\nG92 E0\nG1 E5 F300\nM109 S{nozzle_temperature_initial_layer[initial_no_support_extruder]-20} ; drop nozzle temp, make filament shink a bit\nG92 E0\nG1 E-0.5 F300\n\nG1 X70 F9000\nG1 X76 F15000\nG1 X65 F15000\nG1 X76 F15000\nG1 X65 F15000; shake to put down garbage\nG1 X80 F6000\nG1 X95 F15000\nG1 X80 F15000\nG1 X165 F15000; wipe and shake\nM400\nM106 P1 S0\n;===== prepare print temperature and material end =====\n\n\n;===== wipe nozzle ===============================\nM1002 gcode_claim_action : 14\nM975 S1\nM106 S255\nG1 X65 Y230 F18000\nG1 Y264 F6000\nM109 S{nozzle_temperature_initial_layer[initial_no_support_extruder]-20}\nG1 X100 F18000 ; first wipe mouth\n\nG0 X135 Y253 F20000  ; move to exposed steel surface edge\nG28 Z P0 T300; home z with low precision,permit 300deg temperature\nG29.2 S0 ; turn off ABL\nG0 Z5 F20000\n\nG1 X60 Y265\nG92 E0\nG1 E-0.5 F300 ; retrack more\nG1 X100 F5000; second wipe mouth\nG1 X70 F15000\nG1 X100 F5000\nG1 X70 F15000\nG1 X100 F5000\nG1 X70 F15000\nG1 X100 F5000\nG1 X70 F15000\nG1 X90 F5000\nG0 X128 Y261 Z-1.5 F20000  ; move to exposed steel surface and stop the nozzle\nM104 S140 ; set temp down to heatbed acceptable\nM106 S255 ; turn on fan (G28 has turn off fan)\n\nM221 S; push soft endstop status\nM221 Z0 ;turn off Z axis endstop\nG0 Z0.5 F20000\nG0 X125 Y259.5 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y262.5\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y260.0\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y262.0\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y260.5\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y261.5\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y261.0\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 X128\nG2 I0.5 J0 F300\nG2 I0.5 J0 F300\nG2 I0.5 J0 F300\nG2 I0.5 J0 F300\n\nM109 S140 ; wait nozzle temp down to heatbed acceptable\nG2 I0.5 J0 F3000\nG2 I0.5 J0 F3000\nG2 I0.5 J0 F3000\nG2 I0.5 J0 F3000\n\nM221 R; pop softend status\nG1 Z10 F1200\nM400\nG1 Z10\nG1 F30000\nG1 X128 Y128\nG29.2 S1 ; turn on ABL\n;G28 ; home again after hard wipe mouth\nM106 S0 ; turn off fan , too noisy\n;===== wipe nozzle end ================================\n\n;===== check scanner clarity ===========================\nG1 X128 Y128 F24000\nG28 Z P0\nM972 S5 P0\nG1 X230 Y15 F24000\n;===== check scanner clarity end =======================\n\n;===== bed leveling ==================================\nM1002 judge_flag g29_before_print_flag\nM622 J1\n\n    M1002 gcode_claim_action : 1\n    G29 A X{first_layer_print_min[0]} Y{first_layer_print_min[1]} I{first_layer_print_size[0]} J{first_layer_print_size[1]}\n    M400\n    M500 ; save cali data\n\nM623\n;===== bed leveling end ================================\n\n;===== home after wipe mouth============================\nM1002 judge_flag g29_before_print_flag\nM622 J0\n\n    M1002 gcode_claim_action : 13\n    G28\n\nM623\n;===== home after wipe mouth end =======================\n\nM975 S1 ; turn on vibration supression\n\n;=============turn on fans to prevent PLA jamming=================\n{if filament_type[initial_no_support_extruder]=="PLA"}\n    {if (bed_temperature[initial_no_support_extruder] >45)||(bed_temperature_initial_layer[initial_no_support_extruder] >45)}\n    M106 P3 S180\n    {endif};Prevent PLA from jamming\n    M142 P1 R35 S40\n{endif}\nM106 P2 S100 ; turn on big fan ,to cool down toolhead\n\nM104 S{nozzle_temperature_initial_layer[initial_no_support_extruder]} ; set extrude temp earlier, to reduce wait time\n\n;===== mech mode fast check============================\nG1 X128 Y128 Z10 F20000\nM400 P200\nM970.3 Q1 A7 B30 C80  H15 K0\nM974 Q1 S2 P0\n\nG1 X128 Y128 Z10 F20000\nM400 P200\nM970.3 Q0 A7 B30 C90 Q0 H15 K0\nM974 Q0 S2 P0\n\nM975 S1\nG1 F30000\nG1 X230 Y15\nG28 X ; re-home XY\n;===== mech mode fast check============================\n\n{if scan_first_layer}\n;start heatbed  scan====================================\nM976 S2 P1\nG90\nG1 X128 Y128 F20000\nM976 S3 P2  ;register void printing detection\n{endif}\n\n;===== nozzle load line ===============================\nM975 S1\nG90\nM83\nT1000\nG1 X18.0 Y1.0 Z0.8 F18000;Move to start position\nM109 S{nozzle_temperature[initial_no_support_extruder]}\nG1 Z0.2\nG0 E2 F300\nG0 X240 E15 F{outer_wall_volumetric_speed/(0.3*0.5)     * 60}\nG0 Y11 E0.700 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\nG0 X239.5\nG0 E0.2\nG0 Y1.5 E0.700\nG0 X231 E0.700 F{outer_wall_volumetric_speed/(0.3*0.5)     * 60}\nM400\n\n;===== for Textured PEI Plate , lower the nozzle as the nozzle was touching topmost of the texture when homing ==\n;curr_bed_type={curr_bed_type}\n{if curr_bed_type=="Textured PEI Plate"}\nG29.1 Z{-0.04} ; for Textured PEI Plate\n{endif}\n\n;===== draw extrinsic para cali paint =================\nM1002 judge_flag extrude_cali_flag\nM622 J1\n\n    M1002 gcode_claim_action : 8\n\n    T1000\n\n    G0 F1200.0 X231 Y12   Z0.2 E0.577\n    G0 F1200.0 X226 Y12   Z0.2 E0.275\n    G0 F1200.0 X226 Y1.5  Z0.2 E0.577\n    G0 F1200.0 X220 Y1.5  Z0.2 E0.330\n    G0 F1200.0 X220 Y8    Z0.2 E0.358\n    G0 F1200.0 X210 Y8    Z0.2 E0.549\n    G0 F1200.0 X210 Y1.5  Z0.2 E0.357\n\n    G0 X48.0 E11.9 F{outer_wall_volumetric_speed/(0.3*0.5)     * 60}\n    G0 X48.0 Y12 E0.772 F1200.0\n    G0 X45.0 E0.22 F1200.0\n    G0 X35.0 Y6.0 E0.86 F1200.0\n\n    ;=========== extruder cali extrusion ==================\n    T1000\n    M83\n    {if default_acceleration > 0}\n        {if outer_wall_acceleration > 0}\n            M204 S[outer_wall_acceleration]\n        {else}\n            M204 S[default_acceleration]\n        {endif}\n    {endif}\n    G0 X35.000 Y6.000 Z0.300 F30000 E0\n    G1 F1500.000 E0.800\n    M106 S0 ; turn off fan\n    G0 X185.000 E9.35441 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G0 X187 Z0\n    G1 F1500.000 E-0.800\n    G0 Z1\n    G0 X180 Z0.3 F18000\n\n    M900 L1000.0 M1.0\n    M900 K0.040\n    G0 X45.000 F30000\n    G0 Y8.000 F30000\n    G1 F1500.000 E0.800\n    G1 X65.000 E1.24726 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X70.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X75.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X80.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X85.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X90.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X95.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X100.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X105.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X110.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X115.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X120.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X125.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X130.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X135.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X140.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X145.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X150.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X155.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X160.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X165.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X170.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X175.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X180.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 F1500.000 E-0.800\n    G1 X183 Z0.15 F30000\n    G1 X185\n    G1 Z1.0\n    G0 Y6.000 F30000 ; move y to clear pos\n    G1 Z0.3\n    M400\n\n    G0 X45.000 F30000\n    M900 K0.020\n    G0 X45.000 F30000\n    G0 Y10.000 F30000\n    G1 F1500.000 E0.800\n    G1 X65.000 E1.24726 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X70.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X75.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X80.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X85.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X90.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X95.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X100.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X105.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X110.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X115.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X120.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X125.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X130.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X135.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X140.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X145.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X150.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X155.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X160.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X165.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X170.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X175.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X180.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 F1500.000 E-0.800\n    G1 X183 Z0.15 F30000\n    G1 X185\n    G1 Z1.0\n    G0 Y6.000 F30000 ; move y to clear pos\n    G1 Z0.3\n    M400\n\n    G0 X45.000 F30000\n    M900 K0.000\n    G0 X45.000 F30000\n    G0 Y12.000 F30000\n    G1 F1500.000 E0.800\n    G1 X65.000 E1.24726 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X70.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X75.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X80.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X85.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X90.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X95.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X100.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X105.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X110.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X115.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X120.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X125.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X130.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X135.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X140.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X145.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X150.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X155.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X160.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X165.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X170.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X175.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X180.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 F1500.000 E-0.800\n    G1 X183 Z0.15 F30000\n    G1 X185\n    G1 Z1.0\n    G0 Y6.000 F30000 ; move y to clear pos\n    G1 Z0.3\n\n    G0 X45.000 F30000 ; move to start point\n\nM623 ; end of "draw extrinsic para cali paint"\n\n\nM1002 judge_flag extrude_cali_flag\nM622 J0\n    G0 X231 Y1.5 F30000\n    G0 X18 E14.3 F{outer_wall_volumetric_speed/(0.3*0.5)     * 60}\nM623\n\nM104 S140\n\n\n;=========== laser and rgb calibration ===========\nM400\nM18 E\nM500 R\n\nM973 S3 P14\n\nG1 X120 Y1.0 Z0.3 F18000.0;Move to first extrude line pos\nT1100\nG1 X235.0 Y1.0 Z0.3 F18000.0;Move to first extrude line pos\nM400 P100\nM960 S1 P1\nM400 P100\nM973 S6 P0; use auto exposure for horizontal laser by xcam\nM960 S0 P0\n\nG1 X240.0 Y6.0 Z0.3 F18000.0;Move to vertical extrude line pos\nM960 S2 P1\nM400 P100\nM973 S6 P1; use auto exposure for vertical laser by xcam\nM960 S0 P0\n\n;=========== handeye calibration ======================\nM1002 judge_flag extrude_cali_flag\nM622 J1\n\n    M973 S3 P1 ; camera start stream\n    M400 P500\n    M973 S1\n    G0 F6000 X228.500 Y4.750 Z0.000\n    M960 S0 P1\n    M973 S1\n    M400 P800\n    M971 S6 P0\n    M973 S2 P0\n    M400 P500\n    G0 Z0.000 F12000\n    M960 S0 P0\n    M960 S1 P1\n    G0 X215.00 Y4.750\n    M400 P200\n    M971 S5 P1\n    M973 S2 P1\n    M400 P500\n    M960 S0 P0\n    M960 S2 P1\n    G0 X228.5 Y6.75\n    M400 P200\n    M971 S5 P3\n    G0 Z0.500 F12000\n    M960 S0 P0\n    M960 S2 P1\n    G0 X228.5 Y6.75\n    M400 P200\n    M971 S5 P4\n    M973 S2 P0\n    M400 P500\n    M960 S0 P0\n    M960 S1 P1\n    G0 X215.00 Y4.750\n    M400 P500\n    M971 S5 P2\n    M963 S1\n    M400 P1500\n    M964\n    T1100\n    G1 Z3 F3000\n\n    M400\n    M500 ; save cali data\n\n    M104 S{nozzle_temperature[initial_no_support_extruder]} ; rise nozzle temp now ,to reduce temp waiting time.\n\n    T1100\n    M400 P400\n    M960 S0 P0\n    G0 F30000.000 Y10.000 X65.000 Z0.000\n    M400 P400\n    M960 S1 P1\n    M400 P50\n\n    M969 S1 N3 A2000\n    G0 F360.000 X181.000 Z0.000\n    M980.3 A70.000 B{outer_wall_volumetric_speed/(1.75*1.75/4*3.14)*60/4} C5.000 D{outer_wall_volumetric_speed/(1.75*1.75/4*3.14)*60} E5.000 F175.000 H1.000 I0.000 J0.020 K0.040\n    M400 P100\n    G0 F20000\n    G0 Z1 ; rise nozzle up\n    T1000 ; change to nozzle space\n    G0 X45.000 Y4.000 F30000 ; move to test line pos\n    M969 S0 ; turn off scanning\n    M960 S0 P0\n\n\n    G1 Z2 F20000\n    T1000\n    G0 X45.000 Y4.000 F30000 E0\n    M109 S{nozzle_temperature[initial_no_support_extruder]}\n    G0 Z0.3\n    G1 F1500.000 E3.600\n    G1 X65.000 E1.24726 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X70.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X75.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X80.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X85.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X90.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X95.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X100.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X105.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X110.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X115.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X120.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X125.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X130.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X135.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n\n    ; see if extrude cali success, if not ,use default value\n    M1002 judge_last_extrude_cali_success\n    M622 J0\n        M400\n        M900 K0.02 M{outer_wall_volumetric_speed/(1.75*1.75/4*3.14)*0.02}\n    M623\n\n    G1 X140.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X145.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X150.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X155.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X160.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X165.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X170.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X175.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X180.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X185.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X190.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X195.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X200.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X205.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X210.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X215.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    G1 X220.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\n    G1 X225.000 E0.31181 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\n    M973 S4\n\nM623\n\n;========turn off light and wait extrude temperature =============\nM1002 gcode_claim_action : 0\nM973 S4 ; turn off scanner\nM400 ; wait all motion done before implement the emprical L parameters\n;M900 L500.0 ; Empirical parameters\nM109 S[nozzle_temperature_initial_layer]\nM960 S1 P0 ; turn off laser\nM960 S2 P0 ; turn off laser\nM106 S0 ; turn off fan\nM106 P2 S0 ; turn off big fan\nM106 P3 S0 ; turn off chamber fan\n\nM975 S1 ; turn on mech mode supression\nG90\nM83\nT1000\n;===== purge line to wipe the nozzle ============================\nG1 E{-retraction_length[initial_no_support_extruder]} F1800\nG1 X18.0 Y2.5 Z0.8 F18000.0;Move to start position\nG1 E{retraction_length[initial_no_support_extruder]} F1800\nM109 S{nozzle_temperature_initial_layer[initial_no_support_extruder]}\nG1 Z0.2\nG0 X239 E15 F{outer_wall_volumetric_speed/(0.3*0.5)    * 60}\nG0 Y12 E0.7 F{outer_wall_volumetric_speed/(0.3*0.5)/4* 60}\n
; machine_switch_extruder_time = 5
; machine_unload_filament_time = 28
; master_extruder_id = 1
; max_bridge_length = 10
; max_layer_height = 0
; max_travel_detour_distance = 0
; min_bead_width = 85%
; min_feature_size = 25%
; min_layer_height = 0.07
; minimum_sparse_infill_area = 15
; mmu_segmented_region_interlocking_depth = 0
; mmu_segmented_region_max_width = 0
; no_slow_down_for_cooling_on_outwalls = 0
; nozzle_diameter = 0.4
; nozzle_flush_dataset = 0
; nozzle_height = 4.2
; nozzle_temperature = 220
; nozzle_temperature_initial_layer = 220
; nozzle_temperature_range_high = 240
; nozzle_temperature_range_low = 190
; nozzle_type = hardened_steel
; nozzle_volume = 107
; nozzle_volume_type = Standard
; only_one_wall_first_layer = 0
; ooze_prevention = 0
; other_layers_print_sequence = 0
; other_layers_print_sequence_nums = 0
; outer_wall_acceleration = 5000
; outer_wall_jerk = 9
; outer_wall_line_width = 0
; outer_wall_speed = 200
; overhang_1_4_speed = 0
; overhang_2_4_speed = 50
; overhang_3_4_speed = 30
; overhang_4_4_speed = 10
; overhang_fan_speed = 100
; overhang_fan_threshold = 95%
; overhang_threshold_participating_cooling = 95%
; overhang_totally_speed = 10
; override_filament_scarf_seam_setting = 0
; physical_extruder_map = 0
; post_process = 
; pre_start_fan_time = 0
; precise_outer_wall = 0
; precise_z_height = 0
; pressure_advance = 0.02
; prime_tower_brim_width = 3
; prime_tower_enable_framework = 0
; prime_tower_extra_rib_length = 0
; prime_tower_fillet_wall = 1
; prime_tower_flat_ironing = 0
; prime_tower_infill_gap = 150%
; prime_tower_lift_height = -1
; prime_tower_lift_speed = 90
; prime_tower_max_speed = 90
; prime_tower_rib_wall = 1
; prime_tower_rib_width = 8
; prime_tower_skip_points = 1
; prime_tower_width = 35
; print_compatible_printers = "Bambu Lab X1 Carbon 0.4 nozzle";"Bambu Lab X1 0.4 nozzle";"Bambu Lab P1S 0.4 nozzle";"Bambu Lab X1E 0.4 nozzle"
; print_extruder_id = 1
; print_extruder_variant = "Direct Drive Standard"
; print_flow_ratio = 1
; print_sequence = by layer
; print_settings_id = 0.20mm Standard @BBL X1C
; printable_area = 0x0,200x0,200x200,0x200
; printable_height = 100
; printer_extruder_id = 1
; printer_extruder_variant = "Direct Drive Standard"
; printer_model = Bambu Lab X1 Carbon
; printer_notes = 
; printer_settings_id = Bambu Lab X1 Carbon 0.4 nozzle
; printer_structure = undefine
; printer_technology = FFF
; printer_variant = 0.4
; printing_by_object_gcode = 
; process_notes = 
; raft_contact_distance = 0.1
; raft_expansion = 1.5
; raft_first_layer_density = 90%
; raft_first_layer_expansion = -1
; raft_layers = 0
; reduce_crossing_wall = 0
; reduce_fan_stop_start_freq = 0
; reduce_infill_retraction = 0
; required_nozzle_HRC = 0
; resolution = 0.01
; retract_before_wipe = 0%
; retract_length_toolchange = 2
; retract_lift_above = 0
; retract_lift_below = 249
; retract_restart_extra = 0
; retract_restart_extra_toolchange = 0
; retract_when_changing_layer = 1
; retraction_distances_when_cut = 18
; retraction_distances_when_ec = 0
; retraction_length = 0.8
; retraction_minimum_travel = 1
; retraction_speed = 30
; role_base_wipe_speed = 1
; scan_first_layer = 1
; scarf_angle_threshold = 155
; seam_gap = 15%
; seam_placement_away_from_overhangs = 0
; seam_position = aligned
; seam_slope_conditional = 1
; seam_slope_entire_loop = 0
; seam_slope_gap = 0
; seam_slope_inner_walls = 1
; seam_slope_min_length = 10
; seam_slope_start_height = 10%
; seam_slope_steps = 10
; seam_slope_type = none
; silent_mode = 0
; single_extruder_multi_material = 0
; skeleton_infill_density = 15%
; skeleton_infill_line_width = 0.4
; skin_infill_density = 15%
; skin_infill_depth = 2
; skin_infill_line_width = 0.4
; skirt_distance = 2
; skirt_height = 1
; skirt_loops = 1
; slice_closing_radius = 0.049
; slicing_mode = regular
; slow_down_for_layer_cooling = 1
; slow_down_layer_time = 5
; slow_down_min_speed = 10
; slowdown_end_acc = 100000
; slowdown_end_height = 400
; slowdown_end_speed = 1000
; slowdown_start_acc = 100000
; slowdown_start_height = 0
; slowdown_start_speed = 1000
; small_perimeter_speed = 50%
; small_perimeter_threshold = 0
; smooth_coefficient = 150
; smooth_speed_discontinuity_area = 1
; solid_infill_filament = 1
; sparse_infill_acceleration = 100%
; sparse_infill_anchor = 400%
; sparse_infill_anchor_max = 20
; sparse_infill_density = 20%
; sparse_infill_filament = 1
; sparse_infill_line_width = 0.4
; sparse_infill_pattern = cubic
; sparse_infill_speed = 270
; spiral_mode = 0
; spiral_mode_max_xy_smoothing = 200%
; spiral_mode_smooth = 0
; standby_temperature_delta = -5
; start_end_points = 30x-3,54x245
; supertack_plate_temp = 35
; supertack_plate_temp_initial_layer = 35
; support_air_filtration = 0
; support_angle = 0
; support_base_pattern = default
; support_base_pattern_spacing = 2.5
; support_bottom_interface_spacing = 0.5
; support_bottom_z_distance = 0.2
; support_chamber_temp_control = 0
; support_critical_regions_only = 0
; support_expansion = 0
; support_filament = 0
; support_interface_bottom_layers = 0
; support_interface_filament = 0
; support_interface_loop_pattern = 0
; support_interface_not_for_body = 1
; support_interface_pattern = auto
; support_interface_spacing = 0.5
; support_interface_speed = 80
; support_interface_top_layers = 3
; support_line_width = 0.4
; support_object_first_layer_gap = 0.2
; support_object_skip_flush = 0
; support_object_xy_distance = 0.35
; support_on_build_plate_only = 0
; support_remove_small_overhang = 1
; support_speed = 150
; support_style = default
; support_threshold_angle = 30
; support_top_z_distance = 0.2
; support_type = normal(auto)
; symmetric_infill_y_axis = 0
; temperature_vitrification = 100
; template_custom_gcode = 
; textured_plate_temp = 45
; textured_plate_temp_initial_layer = 45
; thick_bridges = 0
; thumbnail_size = 50x50
; time_lapse_gcode = ;========Date 20250206========\n; SKIPPABLE_START\n; SKIPTYPE: timelapse\nM622.1 S1 ; for prev firmware, default turned on\nM1002 judge_flag timelapse_record_flag\nM622 J1\n{if timelapse_type == 0} ; timelapse without wipe tower\nM971 S11 C10 O0\nM1004 S5 P1  ; external shutter\n{elsif timelapse_type == 1} ; timelapse with wipe tower\nG92 E0\nG1 X65 Y245 F20000 ; move to safe pos\nG17\nG2 Z{layer_z} I0.86 J0.86 P1 F20000\nG1 Y265 F3000\nM400\nM1004 S5 P1  ; external shutter\nM400 P300\nM971 S11 C10 O0\nG92 E0\nG1 X100 F5000\nG1 Y255 F20000\n{endif}\nM623\n; SKIPPABLE_END\n
; timelapse_type = 0
; top_area_threshold = 200%
; top_color_penetration_layers = 4
; top_one_wall_type = all top
; top_shell_layers = 4
; top_shell_thickness = 0.6
; top_solid_infill_flow_ratio = 1
; top_surface_acceleration = 2000
; top_surface_jerk = 9
; top_surface_line_width = 0.4
; top_surface_pattern = zig-zag
; top_surface_speed = 200
; top_z_overrides_xy_distance = 0
; travel_acceleration = 10000
; travel_jerk = 9
; travel_speed = 500
; travel_speed_z = 0
; tree_support_branch_angle = 40
; tree_support_branch_diameter = 5
; tree_support_branch_diameter_angle = 5
; tree_support_branch_distance = 5
; tree_support_wall_count = -1
; upward_compatible_machine = "Bambu Lab P1S 0.4 nozzle";"Bambu Lab P1P 0.4 nozzle";"Bambu Lab X1 0.4 nozzle";"Bambu Lab X1E 0.4 nozzle";"Bambu Lab A1 0.4 nozzle";"Bambu Lab H2D 0.4 nozzle";"Bambu Lab H2D Pro 0.4 nozzle";"Bambu Lab H2S 0.4 nozzle";"Bambu Lab P2S 0.4 nozzle"
; use_firmware_retraction = 0
; use_relative_e_distances = 1
; vertical_shell_speed = 80%
; volumetric_speed_coefficients = "0 0 0 0 0 0"
; wall_distribution_count = 1
; wall_filament = 1
; wall_generator = arachne
; wall_loops = 2
; wall_sequence = inner wall/outer wall
; wall_transition_angle = 10
; wall_transition_filter_deviation = 25%
; wall_transition_length = 100%
; wipe = 1
; wipe_distance = 2
; wipe_speed = 80%
; wipe_tower_no_sparse_layers = 0
; wipe_tower_rotation_angle = 0
; wipe_tower_x = 15
; wipe_tower_y = 220
; wrapping_detection_gcode = 
; wrapping_detection_layers = 20
; wrapping_exclude_area = 
; xy_contour_compensation = 0
; xy_hole_compensation = 0
; z_direction_outwall_speed_continuous = 0
; z_hop = 0.4
; z_hop_types = Auto Lift
; CONFIG_BLOCK_END

; EXECUTABLE_BLOCK_START
M73 P0 R11
M201 X20000 Y20000 Z500 E5000
M203 X500 Y500 Z20 E30
M204 P20000 R5000 T20000
M205 X9.00 Y9.00 Z3.00 E2.50
; FEATURE: Custom
;===== machine: X1-0.4 ====================
;===== date: 20250909 ==================
;===== start printer sound ================
M17
M400 S1
M1006 S1
M1006 A0 B10 L100 C37 D10 M60 E37 F10 N60
M1006 A0 B10 L100 C41 D10 M60 E41 F10 N60
M1006 A0 B10 L100 C44 D10 M60 E44 F10 N60
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N60
M1006 A46 B10 L100 C43 D10 M70 E39 F10 N100
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N100
M1006 A43 B10 L100 C0 D10 M60 E39 F10 N100
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N100
M1006 A41 B10 L100 C0 D10 M100 E41 F10 N100
M1006 A44 B10 L100 C0 D10 M100 E44 F10 N100
M1006 A49 B10 L100 C0 D10 M100 E49 F10 N100
M1006 A0 B10 L100 C0 D10 M100 E0 F10 N100
M1006 A48 B10 L100 C44 D10 M60 E39 F10 N100
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N100
M1006 A44 B10 L100 C0 D10 M90 E39 F10 N100
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N100
M1006 A46 B10 L100 C43 D10 M60 E39 F10 N100
M1006 W
;===== turn on the HB fan =================
M104 S75 ;set extruder temp to turn on the HB fan and prevent filament oozing from nozzle
;===== reset machine status =================
M290 X40 Y40 Z2.6666666
G91
M17 Z0.4 ; lower the z-motor current
G380 S2 Z30 F300 ; G380 is same as G38; lower the hotbed , to prevent the nozzle is below the hotbed
G380 S2 Z-25 F300 ;
G1 Z5 F300;
G90
M17 X1.2 Y1.2 Z0.75 ; reset motor current to default
M960 S5 P1 ; turn on logo lamp
G90
M220 S100 ;Reset Feedrate
M221 S100 ;Reset Flowrate
M73.2   R1.0 ;Reset left time magnitude
M1002 set_gcode_claim_speed_level : 5
M221 X0 Y0 Z0 ; turn off soft endstop to prevent protential logic problem
G29.1 Z0 ; clear z-trim value first
M204 S10000 ; init ACC set to 10m/s^2

;===== heatbed preheat ====================
M1002 gcode_claim_action : 2
M140 S35 ;set bed temp
M190 S35 ;wait for bed temp


;=========register first layer scan=====
M977 S1 P60


;=============turn on fans to prevent PLA jamming=================

    ;Prevent PLA from jamming
    M142 P1 R35 S40

M106 P2 S100 ; turn on big fan ,to cool down toolhead

;===== prepare print temperature and material ==========
M104 S220 ;set extruder temp
G91
G0 Z10 F1200
G90
G28 X
M975 S1 ; turn on
G1 X60 F12000
G1 Y245
G1 Y265 F3000
M620 M
M620 S0A   ; switch material if AMS exist
    M109 S220
    G1 X120 F12000

    G1 X20 Y50 F12000
    G1 Y-3
    T0
    G1 X54 F12000
    G1 Y265
    M400
M621 S0A
M620.1 E F523.843 T240

M412 S1 ; ===turn on filament runout detection===

M109 S250 ;set nozzle to common flush temp
M106 P1 S0
G92 E0
G1 E50 F200
M400
M104 S220
G92 E0
M73 P38 R7
G1 E50 F200
M400
M106 P1 S255
G92 E0
G1 E5 F300
M109 S200 ; drop nozzle temp, make filament shink a bit
G92 E0
M73 P40 R6
G1 E-0.5 F300

M73 P42 R6
G1 X70 F9000
G1 X76 F15000
G1 X65 F15000
G1 X76 F15000
G1 X65 F15000; shake to put down garbage
G1 X80 F6000
G1 X95 F15000
G1 X80 F15000
G1 X165 F15000; wipe and shake
M400
M106 P1 S0
;===== prepare print temperature and material end =====


;===== wipe nozzle ===============================
M1002 gcode_claim_action : 14
M975 S1
M106 S255
M73 P43 R6
G1 X65 Y230 F18000
G1 Y264 F6000
M109 S200
G1 X100 F18000 ; first wipe mouth

G0 X135 Y253 F20000  ; move to exposed steel surface edge
G28 Z P0 T300; home z with low precision,permit 300deg temperature
G29.2 S0 ; turn off ABL
G0 Z5 F20000

G1 X60 Y265
G92 E0
G1 E-0.5 F300 ; retrack more
G1 X100 F5000; second wipe mouth
G1 X70 F15000
G1 X100 F5000
G1 X70 F15000
G1 X100 F5000
G1 X70 F15000
G1 X100 F5000
G1 X70 F15000
G1 X90 F5000
G0 X128 Y261 Z-1.5 F20000  ; move to exposed steel surface and stop the nozzle
M104 S140 ; set temp down to heatbed acceptable
M106 S255 ; turn on fan (G28 has turn off fan)

M221 S; push soft endstop status
M221 Z0 ;turn off Z axis endstop
G0 Z0.5 F20000
G0 X125 Y259.5 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y262.5
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y260.0
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y262.0
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y260.5
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y261.5
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y261.0
G0 Z-1.01
G0 X131 F211
G0 X124
G0 X128
G2 I0.5 J0 F300
G2 I0.5 J0 F300
G2 I0.5 J0 F300
G2 I0.5 J0 F300

M109 S140 ; wait nozzle temp down to heatbed acceptable
G2 I0.5 J0 F3000
G2 I0.5 J0 F3000
G2 I0.5 J0 F3000
G2 I0.5 J0 F3000

M221 R; pop softend status
G1 Z10 F1200
M400
M73 P44 R6
G1 Z10
G1 F30000
G1 X128 Y128
G29.2 S1 ; turn on ABL
;G28 ; home again after hard wipe mouth
M106 S0 ; turn off fan , too noisy
;===== wipe nozzle end ================================

;===== check scanner clarity ===========================
G1 X128 Y128 F24000
G28 Z P0
M972 S5 P0
G1 X230 Y15 F24000
;===== check scanner clarity end =======================

;===== bed leveling ==================================
M1002 judge_flag g29_before_print_flag
M622 J1

    M1002 gcode_claim_action : 1
    G29 A X92.4644 Y92.4644 I15.0712 J15.0712
    M400
    M500 ; save cali data

M623
;===== bed leveling end ================================

;===== home after wipe mouth============================
M1002 judge_flag g29_before_print_flag
M622 J0

    M1002 gcode_claim_action : 13
    G28

M623
;===== home after wipe mouth end =======================

M975 S1 ; turn on vibration supression

;=============turn on fans to prevent PLA jamming=================

    ;Prevent PLA from jamming
    M142 P1 R35 S40

M106 P2 S100 ; turn on big fan ,to cool down toolhead

M104 S220 ; set extrude temp earlier, to reduce wait time

;===== mech mode fast check============================
G1 X128 Y128 Z10 F20000
M400 P200
M970.3 Q1 A7 B30 C80  H15 K0
M974 Q1 S2 P0

G1 X128 Y128 Z10 F20000
M400 P200
M970.3 Q0 A7 B30 C90 Q0 H15 K0
M974 Q0 S2 P0

M975 S1
G1 F30000
G1 X230 Y15
G28 X ; re-home XY
;===== mech mode fast check============================


;start heatbed  scan====================================
M976 S2 P1
G90
G1 X128 Y128 F20000
M976 S3 P2  ;register void printing detection


;===== nozzle load line ===============================
M975 S1
G90
M83
T1000
M73 P45 R6
G1 X18.0 Y1.0 Z0.8 F18000;Move to start position
M109 S220
G1 Z0.2
G0 E2 F300
G0 X240 E15 F5713.27
G0 Y11 E0.700 F1428.32
G0 X239.5
G0 E0.2
G0 Y1.5 E0.700
G0 X231 E0.700 F5713.27
M400

;===== for Textured PEI Plate , lower the nozzle as the nozzle was touching topmost of the texture when homing ==
;curr_bed_type=Cool Plate


;===== draw extrinsic para cali paint =================
M1002 judge_flag extrude_cali_flag
M622 J1

    M1002 gcode_claim_action : 8

    T1000

    G0 F1200.0 X231 Y12   Z0.2 E0.577
    G0 F1200.0 X226 Y12   Z0.2 E0.275
    G0 F1200.0 X226 Y1.5  Z0.2 E0.577
    G0 F1200.0 X220 Y1.5  Z0.2 E0.330
    G0 F1200.0 X220 Y8    Z0.2 E0.358
    G0 F1200.0 X210 Y8    Z0.2 E0.549
    G0 F1200.0 X210 Y1.5  Z0.2 E0.357

    G0 X48.0 E11.9 F5713.27
    G0 X48.0 Y12 E0.772 F1200.0
    G0 X45.0 E0.22 F1200.0
    G0 X35.0 Y6.0 E0.86 F1200.0

    ;=========== extruder cali extrusion ==================
    T1000
    M83
    
        
            M204 S5000
        
    
    G0 X35.000 Y6.000 Z0.300 F30000 E0
    G1 F1500.000 E0.800
    M106 S0 ; turn off fan
    G0 X185.000 E9.35441 F5713.27
    G0 X187 Z0
    G1 F1500.000 E-0.800
    G0 Z1
    G0 X180 Z0.3 F18000

    M900 L1000.0 M1.0
    M900 K0.040
    G0 X45.000 F30000
    G0 Y8.000 F30000
    G1 F1500.000 E0.800
    G1 X65.000 E1.24726 F1428.32
M73 P46 R6
    G1 X70.000 E0.31181 F1428.32
    G1 X75.000 E0.31181 F5713.27
    G1 X80.000 E0.31181 F1428.32
    G1 X85.000 E0.31181 F5713.27
    G1 X90.000 E0.31181 F1428.32
    G1 X95.000 E0.31181 F5713.27
    G1 X100.000 E0.31181 F1428.32
    G1 X105.000 E0.31181 F5713.27
    G1 X110.000 E0.31181 F1428.32
    G1 X115.000 E0.31181 F5713.27
M73 P47 R6
    G1 X120.000 E0.31181 F1428.32
    G1 X125.000 E0.31181 F5713.27
    G1 X130.000 E0.31181 F1428.32
    G1 X135.000 E0.31181 F5713.27
    G1 X140.000 E0.31181 F1428.32
    G1 X145.000 E0.31181 F5713.27
    G1 X150.000 E0.31181 F1428.32
M73 P48 R6
    G1 X155.000 E0.31181 F5713.27
    G1 X160.000 E0.31181 F1428.32
    G1 X165.000 E0.31181 F5713.27
    G1 X170.000 E0.31181 F1428.32
    G1 X175.000 E0.31181 F5713.27
    G1 X180.000 E0.31181 F5713.27
    G1 F1500.000 E-0.800
    G1 X183 Z0.15 F30000
M73 P48 R5
    G1 X185
    G1 Z1.0
    G0 Y6.000 F30000 ; move y to clear pos
    G1 Z0.3
    M400

    G0 X45.000 F30000
    M900 K0.020
    G0 X45.000 F30000
    G0 Y10.000 F30000
    G1 F1500.000 E0.800
    G1 X65.000 E1.24726 F1428.32
    G1 X70.000 E0.31181 F1428.32
    G1 X75.000 E0.31181 F5713.27
    G1 X80.000 E0.31181 F1428.32
    G1 X85.000 E0.31181 F5713.27
    G1 X90.000 E0.31181 F1428.32
    G1 X95.000 E0.31181 F5713.27
    G1 X100.000 E0.31181 F1428.32
    G1 X105.000 E0.31181 F5713.27
M73 P49 R5
    G1 X110.000 E0.31181 F1428.32
    G1 X115.000 E0.31181 F5713.27
    G1 X120.000 E0.31181 F1428.32
    G1 X125.000 E0.31181 F5713.27
    G1 X130.000 E0.31181 F1428.32
    G1 X135.000 E0.31181 F5713.27
    G1 X140.000 E0.31181 F1428.32
    G1 X145.000 E0.31181 F5713.27
    G1 X150.000 E0.31181 F1428.32
    G1 X155.000 E0.31181 F5713.27
    G1 X160.000 E0.31181 F1428.32
    G1 X165.000 E0.31181 F5713.27
    G1 X170.000 E0.31181 F1428.32
    G1 X175.000 E0.31181 F5713.27
    G1 X180.000 E0.31181 F5713.27
    G1 F1500.000 E-0.800
M73 P50 R5
    G1 X183 Z0.15 F30000
    G1 X185
    G1 Z1.0
    G0 Y6.000 F30000 ; move y to clear pos
    G1 Z0.3
    M400

    G0 X45.000 F30000
    M900 K0.000
    G0 X45.000 F30000
    G0 Y12.000 F30000
    G1 F1500.000 E0.800
    G1 X65.000 E1.24726 F1428.32
    G1 X70.000 E0.31181 F1428.32
    G1 X75.000 E0.31181 F5713.27
    G1 X80.000 E0.31181 F1428.32
    G1 X85.000 E0.31181 F5713.27
    G1 X90.000 E0.31181 F1428.32
    G1 X95.000 E0.31181 F5713.27
    G1 X100.000 E0.31181 F1428.32
    G1 X105.000 E0.31181 F5713.27
    G1 X110.000 E0.31181 F1428.32
    G1 X115.000 E0.31181 F5713.27
    G1 X120.000 E0.31181 F1428.32
    G1 X125.000 E0.31181 F5713.27
    G1 X130.000 E0.31181 F1428.32
    G1 X135.000 E0.31181 F5713.27
M73 P51 R5
    G1 X140.000 E0.31181 F1428.32
    G1 X145.000 E0.31181 F5713.27
    G1 X150.000 E0.31181 F1428.32
    G1 X155.000 E0.31181 F5713.27
    G1 X160.000 E0.31181 F1428.32
    G1 X165.000 E0.31181 F5713.27
    G1 X170.000 E0.31181 F1428.32
    G1 X175.000 E0.31181 F5713.27
    G1 X180.000 E0.31181 F5713.27
    G1 F1500.000 E-0.800
    G1 X183 Z0.15 F30000
    G1 X185
    G1 Z1.0
    G0 Y6.000 F30000 ; move y to clear pos
    G1 Z0.3

    G0 X45.000 F30000 ; move to start point

M623 ; end of "draw extrinsic para cali paint"


M1002 judge_flag extrude_cali_flag
M622 J0
    G0 X231 Y1.5 F30000
    G0 X18 E14.3 F5713.27
M623

M104 S140


;=========== laser and rgb calibration ===========
M400
M18 E
M500 R

M973 S3 P14

G1 X120 Y1.0 Z0.3 F18000.0;Move to first extrude line pos
T1100
G1 X235.0 Y1.0 Z0.3 F18000.0;Move to first extrude line pos
M400 P100
M960 S1 P1
M400 P100
M973 S6 P0; use auto exposure for horizontal laser by xcam
M960 S0 P0

G1 X240.0 Y6.0 Z0.3 F18000.0;Move to vertical extrude line pos
M960 S2 P1
M400 P100
M973 S6 P1; use auto exposure for vertical laser by xcam
M960 S0 P0

;=========== handeye calibration ======================
M1002 judge_flag extrude_cali_flag
M622 J1

    M973 S3 P1 ; camera start stream
    M400 P500
    M973 S1
    G0 F6000 X228.500 Y4.750 Z0.000
    M960 S0 P1
    M973 S1
    M400 P800
    M971 S6 P0
    M973 S2 P0
    M400 P500
    G0 Z0.000 F12000
    M960 S0 P0
    M960 S1 P1
    G0 X215.00 Y4.750
    M400 P200
    M971 S5 P1
    M973 S2 P1
    M400 P500
    M960 S0 P0
    M960 S2 P1
    G0 X228.5 Y6.75
    M400 P200
    M971 S5 P3
    G0 Z0.500 F12000
    M960 S0 P0
    M960 S2 P1
    G0 X228.5 Y6.75
    M400 P200
    M971 S5 P4
    M973 S2 P0
    M400 P500
    M960 S0 P0
    M960 S1 P1
    G0 X215.00 Y4.750
    M400 P500
    M971 S5 P2
    M963 S1
    M400 P1500
    M964
    T1100
    G1 Z3 F3000

    M400
    M500 ; save cali data

    M104 S220 ; rise nozzle temp now ,to reduce temp waiting time.

    T1100
    M400 P400
    M960 S0 P0
    G0 F30000.000 Y10.000 X65.000 Z0.000
    M400 P400
    M960 S1 P1
    M400 P50

    M969 S1 N3 A2000
    G0 F360.000 X181.000 Z0.000
    M980.3 A70.000 B89.1191 C5.000 D356.476 E5.000 F175.000 H1.000 I0.000 J0.020 K0.040
    M400 P100
    G0 F20000
    G0 Z1 ; rise nozzle up
    T1000 ; change to nozzle space
    G0 X45.000 Y4.000 F30000 ; move to test line pos
    M969 S0 ; turn off scanning
    M960 S0 P0


    G1 Z2 F20000
    T1000
    G0 X45.000 Y4.000 F30000 E0
    M109 S220
    G0 Z0.3
    G1 F1500.000 E3.600
    G1 X65.000 E1.24726 F1428.32
    G1 X70.000 E0.31181 F1428.32
    G1 X75.000 E0.31181 F5713.27
    G1 X80.000 E0.31181 F1428.32
    G1 X85.000 E0.31181 F5713.27
    G1 X90.000 E0.31181 F1428.32
    G1 X95.000 E0.31181 F5713.27
    G1 X100.000 E0.31181 F1428.32
    G1 X105.000 E0.31181 F5713.27
    G1 X110.000 E0.31181 F1428.32
    G1 X115.000 E0.31181 F5713.27
    G1 X120.000 E0.31181 F1428.32
    G1 X125.000 E0.31181 F5713.27
    G1 X130.000 E0.31181 F1428.32
    G1 X135.000 E0.31181 F5713.27

    ; see if extrude cali success, if not ,use default value
    M1002 judge_last_extrude_cali_success
    M622 J0
        M400
        M900 K0.02 M0.118825
    M623

    G1 X140.000 E0.31181 F1428.32
    G1 X145.000 E0.31181 F5713.27
    G1 X150.000 E0.31181 F1428.32
    G1 X155.000 E0.31181 F5713.27
    G1 X160.000 E0.31181 F1428.32
    G1 X165.000 E0.31181 F5713.27
    G1 X170.000 E0.31181 F1428.32
    G1 X175.000 E0.31181 F5713.27
    G1 X180.000 E0.31181 F1428.32
    G1 X185.000 E0.31181 F5713.27
    G1 X190.000 E0.31181 F1428.32
    G1 X195.000 E0.31181 F5713.27
    G1 X200.000 E0.31181 F1428.32
    G1 X205.000 E0.31181 F5713.27
    G1 X210.000 E0.31181 F1428.32
M73 P52 R5
    G1 X215.000 E0.31181 F5713.27
    G1 X220.000 E0.31181 F1428.32
    G1 X225.000 E0.31181 F5713.27
    M973 S4

M623

;========turn off light and wait extrude temperature =============
M1002 gcode_claim_action : 0
M973 S4 ; turn off scanner
M400 ; wait all motion done before implement the emprical L parameters
;M900 L500.0 ; Empirical parameters
M109 S220
M960 S1 P0 ; turn off laser
M960 S2 P0 ; turn off laser
M106 S0 ; turn off fan
M106 P2 S0 ; turn off big fan
M106 P3 S0 ; turn off chamber fan

M975 S1 ; turn on mech mode supression
G90
M83
T1000
;===== purge line to wipe the nozzle ============================
G1 E-0.8 F1800
G1 X18.0 Y2.5 Z0.8 F18000.0;Move to start position
G1 E0.8 F1800
M109 S220
G1 Z0.2
G0 X239 E15 F5713.27
G0 Y12 E0.7 F1428.32
; MACHINE_START_GCODE_END
; filament start gcode

M142 P1 R35 S40
;VT0
G90
G21
M83 ; use relative distances for extrusion
M981 S1 P20000 ;open spaghetti detector
; CHANGE_LAYER
; Z_HEIGHT: 0.2
; LAYER_HEIGHT: 0.2
G1 E-.8 F1800
M106 S0
M204 S6000
G1 Z.4 F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

G1 X93.034 Y91.699
G1 Z.2
G1 E.8 F1800
; FEATURE: Skirt
; LINE_WIDTH: 0.4
G1 F3000
M204 S500
G1 X94.079 Y90.83 E.03953
G1 X95 Y90.643 E.02735
G1 X105 Y90.643 E.29097
G1 X106.301 Y91.034 E.03953
G1 X107.17 Y92.079 E.03953
G1 X107.357 Y93 E.02735
G1 X107.357 Y103 E.29097
G1 X106.966 Y104.301 E.03953
G1 X105.921 Y105.17 E.03953
G1 X105 Y105.357 E.02735
G1 X95 Y105.357 E.29097
G1 X93.699 Y104.966 E.03953
G1 X92.83 Y103.921 E.03953
G1 X92.643 Y103 E.02735
G1 X92.643 Y93 E.29097
G1 X93.017 Y91.757 E.03778
; OBJECT_ID: 15
; WIPE_START
G1 X94.079 Y90.83 E-.53541
G1 X94.658 Y90.713 E-.22459
; WIPE_END
G1 E-.04 F1800
M204 S6000
G1 X99.547 Y96.574 Z.6 F30000
G1 X104.443 Y102.443 Z.6
G1 Z.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F3000
M204 S500
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
M204 S6000
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F3000
M204 S500
G1 X95.2 Y102.8 E.27933
M73 P53 R5
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
M204 S6000
G1 X104.153 Y95.241 Z.6 F30000
G1 X104.3 Y94.426 Z.6
G1 Z.2
G1 E.8 F1800
; FEATURE: Bottom surface
; LINE_WIDTH: 0.40212
G1 F6300
M204 S500
M73 P54 R5
G1 X103.734 Y93.861 E.02342
G1 X103.226 Y93.861 E.01487
M73 P57 R4
G1 X104.139 Y94.774 E.03779
G1 X104.139 Y95.282 E.01487
G1 X102.719 Y93.861 E.05882
G1 X102.211 Y93.861 E.01487
G1 X104.139 Y95.79 E.07985
G1 X104.139 Y96.298 E.01487
G1 X101.703 Y93.861 E.10088
G1 X101.195 Y93.861 E.01487
G1 X104.139 Y96.805 E.1219
G1 X104.139 Y97.313 E.01487
G1 X100.687 Y93.861 E.14293
G1 X100.179 Y93.861 E.01487
G1 X104.139 Y97.821 E.16396
G1 X104.139 Y98.329 E.01487
G1 X99.671 Y93.861 E.18499
G1 X99.163 Y93.861 E.01487
G1 X104.139 Y98.837 E.20601
G1 X104.139 Y99.345 E.01487
G1 X98.655 Y93.861 E.22704
G1 X98.147 Y93.861 E.01487
G1 X104.139 Y99.853 E.24807
G1 X104.139 Y100.361 E.01487
G1 X97.639 Y93.861 E.2691
G1 X97.131 Y93.861 E.01487
G1 X104.139 Y100.869 E.29013
G1 X104.139 Y101.377 E.01487
G1 X96.623 Y93.861 E.31115
G1 X96.115 Y93.861 E.01487
G1 X104.139 Y101.885 E.33218
G1 X104.139 Y102.139 E.00744
G1 X103.886 Y102.139 E.00743
G1 X95.861 Y94.114 E.33219
G1 X95.861 Y94.622 E.01487
G1 X103.378 Y102.139 E.31116
G1 X102.87 Y102.139 E.01487
G1 X95.861 Y95.13 E.29013
G1 X95.861 Y95.638 E.01487
G1 X102.362 Y102.139 E.26911
G1 X101.854 Y102.139 E.01487
M73 P58 R4
G1 X95.861 Y96.146 E.24808
G1 X95.861 Y96.654 E.01487
G1 X101.346 Y102.139 E.22705
G1 X100.838 Y102.139 E.01487
G1 X95.861 Y97.162 E.20602
G1 X95.861 Y97.67 E.01487
G1 X100.33 Y102.139 E.185
G1 X99.822 Y102.139 E.01487
G1 X95.861 Y98.178 E.16397
G1 X95.861 Y98.686 E.01487
G1 X99.314 Y102.139 E.14294
G1 X98.806 Y102.139 E.01487
G1 X95.861 Y99.194 E.12191
G1 X95.861 Y99.702 E.01487
G1 X98.298 Y102.139 E.10088
G1 X97.79 Y102.139 E.01487
G1 X95.861 Y100.21 E.07986
G1 X95.861 Y100.718 E.01487
G1 X97.282 Y102.139 E.05883
G1 X96.774 Y102.139 E.01487
G1 X95.861 Y101.226 E.0378
G1 X95.861 Y101.734 E.01487
G1 X96.426 Y102.3 E.02343
; CHANGE_LAYER
; Z_HEIGHT: 0.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F6300
G1 X95.861 Y101.734 E-.30412
G1 X95.861 Y101.226 E-.19303
G1 X96.35 Y101.715 E-.26285
; WIPE_END
G1 E-.04 F1800
M106 S252.45
; open powerlost recovery
M1003 S1
M976 S1 P1 ; scan model before printing 2nd layer
M400 P100
G1 E.8
G1 E-.8
M204 S10000
G17
G3 Z.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F3509
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F3509
M204 S5000
G1 X95.2 Y102.8 E.27933
M73 P59 R4
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X103.574 Y102.3 Z.8 F30000
G1 Z.4
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.40212
G1 F3509
G1 X104.139 Y101.734 E.02342
G1 X104.139 Y101.226 E.01487
G1 X103.226 Y102.139 E.03779
G1 X102.719 Y102.139 E.01487
G1 X104.139 Y100.719 E.05882
G1 X104.139 Y100.211 E.01487
G1 X102.211 Y102.139 E.07985
G1 X101.703 Y102.139 E.01487
G1 X104.139 Y99.703 E.10088
G1 X104.139 Y99.195 E.01487
G1 X101.195 Y102.139 E.1219
G1 X100.687 Y102.139 E.01487
G1 X104.139 Y98.687 E.14293
G1 X104.139 Y98.179 E.01487
G1 X100.179 Y102.139 E.16396
G1 X99.671 Y102.139 E.01487
G1 X104.139 Y97.671 E.18499
G1 X104.139 Y97.163 E.01487
G1 X99.163 Y102.139 E.20601
G1 X98.655 Y102.139 E.01487
G1 X104.139 Y96.655 E.22704
G1 X104.139 Y96.147 E.01487
G1 X98.147 Y102.139 E.24807
G1 X97.639 Y102.139 E.01487
G1 X104.139 Y95.639 E.2691
G1 X104.139 Y95.131 E.01487
G1 X97.131 Y102.139 E.29012
G1 X96.623 Y102.139 E.01487
G1 X104.139 Y94.623 E.31115
G1 X104.139 Y94.115 E.01487
G1 X96.115 Y102.139 E.33218
G1 X95.861 Y102.139 E.00744
G1 X95.861 Y101.886 E.00743
G1 X103.886 Y93.861 E.33219
G1 X103.378 Y93.861 E.01487
G1 X95.861 Y101.378 E.31116
G1 X95.861 Y100.87 E.01487
G1 X102.87 Y93.861 E.29013
G1 X102.362 Y93.861 E.01487
G1 X95.861 Y100.362 E.26911
G1 X95.861 Y99.854 E.01487
G1 X101.854 Y93.861 E.24808
G1 X101.346 Y93.861 E.01487
G1 X95.861 Y99.346 E.22705
G1 X95.861 Y98.838 E.01487
G1 X100.838 Y93.861 E.20602
G1 X100.33 Y93.861 E.01487
G1 X95.861 Y98.33 E.185
G1 X95.861 Y97.822 E.01487
G1 X99.822 Y93.861 E.16397
G1 X99.314 Y93.861 E.01487
G1 X95.861 Y97.314 E.14294
G1 X95.861 Y96.806 E.01487
G1 X98.806 Y93.861 E.12191
M73 P60 R4
G1 X98.298 Y93.861 E.01487
G1 X95.861 Y96.298 E.10089
G1 X95.861 Y95.79 E.01487
G1 X97.79 Y93.861 E.07986
G1 X97.282 Y93.861 E.01487
G1 X95.861 Y95.282 E.05883
G1 X95.861 Y94.774 E.01487
G1 X96.774 Y93.861 E.0378
G1 X96.266 Y93.861 E.01487
G1 X95.7 Y94.426 E.02343
; CHANGE_LAYER
; Z_HEIGHT: 0.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15000
G1 X96.266 Y93.861 E-.30412
G1 X96.774 Y93.861 E-.19303
G1 X96.285 Y94.35 E-.26285
; WIPE_END
G1 E-.04 F1800
G17
G3 Z.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F3478
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F3478
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.153 Y95.241 Z1 F30000
G1 X104.3 Y94.426 Z1
G1 Z.6
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.40212
G1 F3478
G1 X103.734 Y93.861 E.02342
G1 X103.226 Y93.861 E.01487
G1 X104.139 Y94.774 E.03779
G1 X104.139 Y95.282 E.01487
G1 X102.719 Y93.861 E.05882
G1 X102.211 Y93.861 E.01487
G1 X104.139 Y95.79 E.07985
G1 X104.139 Y96.298 E.01487
G1 X101.703 Y93.861 E.10088
G1 X101.195 Y93.861 E.01487
G1 X104.139 Y96.805 E.1219
G1 X104.139 Y97.313 E.01487
G1 X100.687 Y93.861 E.14293
G1 X100.179 Y93.861 E.01487
G1 X104.139 Y97.821 E.16396
G1 X104.139 Y98.329 E.01487
G1 X99.671 Y93.861 E.18499
G1 X99.163 Y93.861 E.01487
G1 X104.139 Y98.837 E.20601
G1 X104.139 Y99.345 E.01487
G1 X98.655 Y93.861 E.22704
G1 X98.147 Y93.861 E.01487
G1 X104.139 Y99.853 E.24807
G1 X104.139 Y100.361 E.01487
G1 X97.639 Y93.861 E.2691
G1 X97.131 Y93.861 E.01487
G1 X104.139 Y100.869 E.29013
G1 X104.139 Y101.377 E.01487
G1 X96.623 Y93.861 E.31115
G1 X96.115 Y93.861 E.01487
G1 X104.139 Y101.885 E.33218
G1 X104.139 Y102.139 E.00744
G1 X103.886 Y102.139 E.00743
G1 X95.861 Y94.114 E.33219
G1 X95.861 Y94.622 E.01487
G1 X103.378 Y102.139 E.31116
G1 X102.87 Y102.139 E.01487
G1 X95.861 Y95.13 E.29013
G1 X95.861 Y95.638 E.01487
G1 X102.362 Y102.139 E.26911
G1 X101.854 Y102.139 E.01487
G1 X95.861 Y96.146 E.24808
G1 X95.861 Y96.654 E.01487
G1 X101.346 Y102.139 E.22705
G1 X100.838 Y102.139 E.01487
G1 X95.861 Y97.162 E.20602
G1 X95.861 Y97.67 E.01487
G1 X100.33 Y102.139 E.185
G1 X99.822 Y102.139 E.01487
G1 X95.861 Y98.178 E.16397
G1 X95.861 Y98.686 E.01487
G1 X99.314 Y102.139 E.14294
G1 X98.806 Y102.139 E.01487
G1 X95.861 Y99.194 E.12191
G1 X95.861 Y99.702 E.01487
G1 X98.298 Y102.139 E.10088
G1 X97.79 Y102.139 E.01487
G1 X95.861 Y100.21 E.07986
G1 X95.861 Y100.718 E.01487
G1 X97.282 Y102.139 E.05883
G1 X96.774 Y102.139 E.01487
G1 X95.861 Y101.226 E.0378
G1 X95.861 Y101.734 E.01487
G1 X96.426 Y102.3 E.02343
; CHANGE_LAYER
; Z_HEIGHT: 0.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15000
G1 X95.861 Y101.734 E-.30412
G1 X95.861 Y101.226 E-.19303
G1 X96.35 Y101.715 E-.26285
; WIPE_END
G1 E-.04 F1800
G17
G3 Z1 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1443
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
M73 P61 R4
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1443
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X102.422 Y102.139 Z1.2 F30000
G1 Z.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1443
G1 X103.85 Y102.139 E.04156
G1 X104.139 Y101.06 E.0325
G1 X104.139 Y101.339 E.00812
G1 X96.661 Y93.861 E.30776
G1 X96.939 Y93.861 E.00812
G1 X95.861 Y94.15 E.0325
G1 X95.861 Y95.578 E.04156
; WIPE_START
G1 F16200
G1 X95.861 Y94.15 E-.54276
G1 X96.413 Y94.002 E-.21724
; WIPE_END
G1 E-.04 F1800
G1 X101.952 Y93.861 Z1.2 F30000
G1 Z.8
G1 E.8 F1800
G1 F1443
G1 X100.524 Y93.861 E.04156
G1 X98.305 Y102.139 E.24939
G1 X97.365 Y102.139 E.02737
G1 X95.861 Y100.635 E.06189
G1 X95.861 Y99.695 E.02737
G1 X104.139 Y97.476 E.24939
G1 X104.139 Y96.048 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 1
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X104.139 Y97.476 E-.54276
G1 X103.587 Y97.624 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z1.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z1
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1475
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1475
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y101.139 Z1.4 F30000
G1 Z1
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1475
G1 X96.861 Y93.861 E.29953
; WIPE_START
G1 F16200
G1 X98.275 Y95.275 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y95.724 Z1.4 F30000
G1 Z1
G1 E.8 F1800
G1 F1475
G1 X95.861 Y94.296 E.04156
G1 X97.486 Y93.861 E.04896
G1 X100.377 Y93.861 E.08413
G1 X98.159 Y102.139 E.24939
G1 X97.565 Y102.139 E.01729
G1 X95.861 Y100.435 E.07012
G1 X95.861 Y99.841 E.01729
G1 X104.139 Y97.623 E.24939
G1 X104.139 Y100.514 E.08413
G1 X103.704 Y102.139 E.04896
G1 X102.276 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 1.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.704 Y102.139 E-.54276
G1 X103.852 Y101.587 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z1.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z1.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1461
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1461
M204 S5000
G1 X95.2 Y102.8 E.27933
M73 P62 R4
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y100.939 Z1.6 F30000
G1 Z1.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1461
G1 X97.061 Y93.861 E.2913
; WIPE_START
G1 F16200
G1 X98.475 Y95.275 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y95.871 Z1.6 F30000
G1 Z1.2
G1 E.8 F1800
G1 F1461
G1 X95.861 Y94.442 E.04156
G1 X98.032 Y93.861 E.06542
G1 X100.231 Y93.861 E.06397
G1 X98.012 Y102.139 E.24939
G1 X97.765 Y102.139 E.00721
G1 X95.861 Y100.235 E.07835
G1 X95.861 Y99.988 E.00721
G1 X104.139 Y97.769 E.24939
G1 X104.139 Y99.968 E.06397
G1 X103.558 Y102.139 E.06542
G1 X102.129 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 1.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.558 Y102.139 E-.54276
G1 X103.705 Y101.587 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z1.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z1.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1437
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1437
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
M204 S10000
G1 X104.111 Y102.139 F30000
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1437
G1 X104.139 Y102.139 E.00082
G1 X104.139 Y100.739 E.04074
G1 X97.261 Y93.861 E.28307
G1 X95.861 Y93.861 E.04074
G1 X95.861 Y94.589 E.02119
G1 X98.579 Y93.861 E.08188
G1 X100.084 Y93.861 E.04381
G1 X97.866 Y102.139 E.24939
G1 X97.965 Y102.139 E.00287
M73 P63 R4
G1 X95.861 Y100.035 E.08658
G1 X95.861 Y100.134 E.00287
G1 X104.139 Y97.916 E.24939
G1 X104.139 Y99.421 E.04381
G1 X103.411 Y102.139 E.08188
G1 X101.983 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 1.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.411 Y102.139 E-.54276
G1 X103.559 Y101.587 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z1.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z1.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1467
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1467
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y101.968 Z2 F30000
G1 Z1.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1467
G1 X104.139 Y100.539 E.04156
G1 X97.461 Y93.861 E.27484
G1 X95.861 Y93.861 E.04656
G1 X95.861 Y94.735 E.02545
G1 X99.125 Y93.861 E.09834
G1 X99.938 Y93.861 E.02365
G1 X97.72 Y102.139 E.24939
G1 X98.165 Y102.139 E.01295
G1 X95.861 Y99.835 E.09481
G1 X95.861 Y100.28 E.01295
G1 X104.139 Y98.062 E.24939
G1 X104.139 Y98.875 E.02365
G1 X103.265 Y102.139 E.09834
G1 X101.836 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 1.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.265 Y102.139 E-.54276
G1 X103.413 Y101.587 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z1.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1477
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1477
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
M73 P64 R4
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y101.768 Z2.2 F30000
G1 Z1.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1477
G1 X104.139 Y100.339 E.04156
G1 X97.661 Y93.861 E.26661
G1 X95.861 Y93.861 E.05238
G1 X95.861 Y94.882 E.02971
G1 X99.672 Y93.861 E.1148
G1 X99.791 Y93.861 E.00349
G1 X97.573 Y102.139 E.24939
G1 X98.365 Y102.139 E.02303
G1 X95.861 Y99.635 E.10304
G1 X95.861 Y100.427 E.02303
G1 X104.139 Y98.209 E.24939
G1 X104.139 Y98.328 E.00349
G1 X103.118 Y102.139 E.1148
G1 X101.69 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.118 Y102.139 E-.54276
G1 X103.266 Y101.587 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z2.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1565
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1565
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y98.355 Z2.4 F30000
G1 Z2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1565
G1 X95.861 Y100.573 E.24939
G1 X95.861 Y99.435 E.03311
M73 P65 R4
G1 X98.565 Y102.139 E.11127
G1 X97.427 Y102.139 E.03311
G1 X99.645 Y93.861 E.24939
; WIPE_START
G1 F16200
G1 X99.127 Y95.792 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X101.646 Y93.861 Z2.4 F30000
G1 Z2
G1 E.8 F1800
G1 F1565
G1 X100.218 Y93.861 E.04156
G1 X95.861 Y95.028 E.13126
G1 X95.861 Y93.861 E.03397
G1 X97.861 Y93.861 E.05819
G1 X104.139 Y100.139 E.25838
G1 X104.139 Y102.139 E.05819
G1 X102.972 Y102.139 E.03397
G1 X104.139 Y97.782 E.13126
G1 X104.139 Y96.354 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 2.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X104.139 Y97.782 E-.54276
G1 X103.991 Y98.334 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z2.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z2.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1639
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1639
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
M73 P65 R3
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y102.131 Z2.6 F30000
G1 Z2.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1639
G1 X97.28 Y102.139 E.04131
G1 X99.499 Y93.861 E.24939
G1 X98.061 Y93.861 E.04184
G1 X104.139 Y99.939 E.25015
G1 X104.139 Y98.501 E.04185
G1 X95.861 Y100.72 E.24939
G1 X95.861 Y99.235 E.04319
G1 X98.765 Y102.139 E.1195
M73 P66 R3
G1 X102.825 Y102.139 E.11816
G1 X104.139 Y97.236 E.14772
G1 X104.139 Y93.861 E.0982
G1 X100.764 Y93.861 E.09821
G1 X95.861 Y95.175 E.14772
G1 X95.861 Y96.603 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 2.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y95.175 E-.54276
G1 X96.413 Y95.027 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z2.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z2.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1635
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1635
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y101.984 Z2.8 F30000
G1 Z2.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1635
G1 X95.861 Y102.139 E.00451
G1 X97.134 Y102.139 E.03705
G1 X99.352 Y93.861 E.24939
G1 X98.261 Y93.861 E.03177
G1 X104.139 Y99.739 E.24192
G1 X104.139 Y98.648 E.03177
G1 X95.861 Y100.866 E.24939
G1 X95.861 Y99.035 E.05327
G1 X98.965 Y102.139 E.12773
G1 X102.679 Y102.139 E.10808
G1 X104.139 Y96.689 E.16418
G1 X104.139 Y93.861 E.08231
G1 X101.311 Y93.861 E.08231
G1 X95.861 Y95.321 E.16418
G1 X95.861 Y93.893 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 2.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y95.321 E-.54276
G1 X96.413 Y95.173 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z2.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z2.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1627
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1627
M204 S5000
G1 X95.2 Y102.8 E.27933
M73 P67 R3
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y101.838 Z3 F30000
G1 Z2.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1627
G1 X95.861 Y102.139 E.00877
G1 X96.988 Y102.139 E.03279
G1 X99.206 Y93.861 E.24939
G1 X98.461 Y93.861 E.02169
G1 X104.139 Y99.539 E.23369
G1 X104.139 Y98.794 E.02169
G1 X95.861 Y101.012 E.24939
G1 X95.861 Y98.835 E.06335
G1 X99.165 Y102.139 E.13596
G1 X102.533 Y102.139 E.098
G1 X104.139 Y96.143 E.18064
G1 X104.139 Y93.861 E.06641
G1 X101.857 Y93.861 E.06641
G1 X95.861 Y95.467 E.18064
G1 X95.861 Y94.039 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 2.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y95.467 E-.54276
G1 X96.413 Y95.319 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z3 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z2.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1617
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1617
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X98.269 Y102.139 Z3.2 F30000
G1 Z2.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1617
M73 P68 R3
G1 X96.841 Y102.139 E.04156
G1 X99.059 Y93.861 E.24939
G1 X98.661 Y93.861 E.01161
G1 X104.139 Y99.339 E.22546
G1 X104.139 Y98.941 E.01161
G1 X95.861 Y101.159 E.24939
G1 X95.861 Y98.635 E.07343
G1 X99.365 Y102.139 E.14419
G1 X102.386 Y102.139 E.08792
G1 X104.139 Y95.596 E.1971
G1 X104.139 Y93.861 E.05051
G1 X102.404 Y93.861 E.05051
G1 X95.861 Y95.614 E.1971
G1 X95.861 Y94.185 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 3
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y95.614 E-.54276
G1 X96.413 Y95.466 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z3.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z3
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1609
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1609
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X98.123 Y102.139 Z3.4 F30000
G1 Z3
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1609
G1 X96.695 Y102.139 E.04156
G1 X98.913 Y93.861 E.24939
G1 X98.861 Y93.861 E.00153
G1 X104.139 Y99.139 E.21723
G1 X104.139 Y99.087 E.00153
G1 X95.861 Y101.305 E.24939
G1 X95.861 Y98.435 E.08351
G1 X99.565 Y102.139 E.15242
G1 X102.24 Y102.139 E.07784
G1 X104.139 Y95.05 E.21356
G1 X104.139 Y93.861 E.03461
G1 X102.95 Y93.861 E.03461
G1 X95.861 Y95.76 E.21356
G1 X95.861 Y94.332 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 3.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y95.76 E-.54276
G1 X96.413 Y95.612 E-.21725
; WIPE_END
M73 P69 R3
G1 E-.04 F1800
G17
G3 Z3.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z3.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1616
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1616
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X97.977 Y102.139 Z3.6 F30000
G1 Z3.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1616
G1 X96.548 Y102.139 E.04156
G1 X98.767 Y93.861 E.24939
G1 X99.061 Y93.861 E.00855
G1 X104.139 Y98.939 E.209
G1 X104.139 Y99.233 E.00855
G1 X95.861 Y101.452 E.24939
G1 X95.861 Y98.235 E.09359
G1 X99.765 Y102.139 E.16065
G1 X102.093 Y102.139 E.06776
G1 X104.139 Y94.504 E.23002
G1 X104.139 Y93.861 E.01871
G1 X103.496 Y93.861 E.01871
G1 X95.861 Y95.907 E.23002
G1 X95.861 Y94.478 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 3.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y95.907 E-.54276
G1 X96.413 Y95.759 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z3.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z3.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1625
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1625
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
M73 P70 R3
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X97.83 Y102.139 Z3.8 F30000
G1 Z3.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1625
G1 X96.402 Y102.139 E.04156
G1 X98.62 Y93.861 E.24939
G1 X99.261 Y93.861 E.01863
G1 X104.139 Y98.739 E.20077
G1 X104.139 Y99.38 E.01863
G1 X95.861 Y101.598 E.24939
G1 X95.861 Y98.035 E.10367
G1 X99.965 Y102.139 E.16888
G1 X101.947 Y102.139 E.05768
G1 X104.139 Y93.957 E.24648
G1 X104.139 Y93.861 E.00281
G1 X104.043 Y93.861 E.00281
G1 X95.861 Y96.053 E.24648
G1 X95.861 Y94.625 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 3.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y96.053 E-.54276
G1 X96.413 Y95.905 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z3.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z3.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1649
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1649
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.981 Y99.324 Z4 F30000
G1 X95.861 Y99.264 Z4
G1 Z3.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1649
G1 X95.861 Y97.835 E.04156
M73 P71 R3
G1 X100.165 Y102.139 E.17711
G1 X101.801 Y102.139 E.0476
G1 X104.019 Y93.861 E.24939
G1 X104.139 Y93.861 E.00351
G1 X104.139 Y93.981 E.00351
G1 X95.861 Y96.199 E.24939
G1 X95.861 Y93.861 E.06805
G1 X98.474 Y93.861 E.07604
G1 X96.255 Y102.139 E.24939
G1 X95.861 Y102.139 E.01149
G1 X95.861 Y101.745 E.01149
G1 X104.139 Y99.526 E.24939
G1 X104.139 Y98.539 E.02871
G1 X99.461 Y93.861 E.19254
G1 X100.889 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 3.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X99.461 Y93.861 E-.54276
G1 X99.865 Y94.265 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z3.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1649
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1649
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X101.358 Y95.258 Z4.2 F30000
G1 X101.089 Y93.861 Z4.2
G1 Z3.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1649
G1 X99.661 Y93.861 E.04156
G1 X104.139 Y98.339 E.18431
G1 X104.139 Y99.673 E.03879
G1 X95.861 Y101.891 E.24939
G1 X95.861 Y102.139 E.00723
G1 X96.109 Y102.139 E.00723
G1 X98.327 Y93.861 E.24939
G1 X95.861 Y93.861 E.07178
G1 X95.861 Y96.346 E.07231
G1 X104.139 Y94.128 E.24939
G1 X104.139 Y93.861 E.00777
G1 X103.873 Y93.861 E.00777
G1 X101.654 Y102.139 E.24939
M73 P72 R3
G1 X100.365 Y102.139 E.03752
G1 X95.861 Y97.635 E.18534
G1 X95.861 Y99.064 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y97.635 E-.54276
G1 X96.265 Y98.04 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z4.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1649
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1649
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X101.521 Y95.228 Z4.4 F30000
G1 X101.289 Y93.861 Z4.4
G1 Z4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1649
G1 X99.861 Y93.861 E.04156
G1 X104.139 Y98.139 E.17608
G1 X104.139 Y99.819 E.04887
G1 X95.861 Y102.037 E.24939
G1 X95.861 Y102.139 E.00297
G1 X95.963 Y102.139 E.00297
G1 X98.181 Y93.861 E.24939
G1 X95.861 Y93.861 E.06752
G1 X95.861 Y96.492 E.07657
G1 X104.139 Y94.274 E.24939
G1 X104.139 Y93.861 E.01203
G1 X103.726 Y93.861 E.01203
G1 X101.508 Y102.139 E.24939
G1 X100.565 Y102.139 E.02744
G1 X95.861 Y97.435 E.19357
G1 X95.861 Y98.864 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 4.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y97.435 E-.54276
G1 X96.265 Y97.84 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z4.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z4.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1624
G1 X95.557 Y102.443 E.25855
M73 P73 R3
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1624
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y95.849 Z4.6 F30000
G1 Z4.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1624
G1 X104.139 Y94.42 E.04156
G1 X95.861 Y96.639 E.24939
G1 X95.861 Y97.235 E.01736
G1 X100.765 Y102.139 E.2018
G1 X101.361 Y102.139 E.01736
G1 X103.58 Y93.861 E.24939
G1 X100.061 Y93.861 E.1024
G1 X104.139 Y97.939 E.16785
G1 X104.139 Y99.965 E.05895
G1 X96.026 Y102.139 E.24441
G1 X95.861 Y102.139 E.00481
G1 X95.861 Y101.974 E.00481
G1 X98.035 Y93.861 E.24441
G1 X96.606 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 4.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X98.035 Y93.861 E-.54276
G1 X97.887 Y94.413 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z4.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z4.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1616
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1616
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y95.995 Z4.8 F30000
G1 Z4.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
M73 P74 R3
G1 F1616
G1 X104.139 Y94.567 E.04156
G1 X95.861 Y96.785 E.24939
G1 X95.861 Y97.035 E.00728
G1 X100.965 Y102.139 E.21003
G1 X101.215 Y102.139 E.00728
G1 X103.433 Y93.861 E.24939
G1 X100.261 Y93.861 E.09232
G1 X104.139 Y97.739 E.15962
G1 X104.139 Y100.112 E.06903
G1 X96.572 Y102.139 E.22795
G1 X95.861 Y102.139 E.02071
G1 X95.861 Y101.428 E.02071
G1 X97.888 Y93.861 E.22795
M73 P74 R2
G1 X96.46 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 4.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X97.888 Y93.861 E-.54276
G1 X97.74 Y94.413 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z4.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z4.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1612
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1612
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y96.141 Z5 F30000
G1 Z4.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1612
G1 X104.139 Y94.713 E.04156
G1 X95.861 Y96.931 E.24939
G1 X95.861 Y96.835 E.0028
G1 X101.165 Y102.139 E.21826
G1 X101.069 Y102.139 E.0028
G1 X103.287 Y93.861 E.24939
G1 X100.461 Y93.861 E.08224
G1 X104.139 Y97.539 E.15139
G1 X104.139 Y100.258 E.07911
G1 X97.119 Y102.139 E.21149
G1 X95.861 Y102.139 E.03661
G1 X95.861 Y100.881 E.03661
G1 X97.742 Y93.861 E.21149
G1 X96.313 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 4.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
M73 P75 R2
G1 X97.742 Y93.861 E-.54276
G1 X97.594 Y94.413 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z5 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z4.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1620
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1620
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y96.288 Z5.2 F30000
G1 Z4.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1620
G1 X104.139 Y94.86 E.04156
G1 X95.861 Y97.078 E.24939
G1 X95.861 Y96.635 E.01288
G1 X101.365 Y102.139 E.22649
G1 X100.922 Y102.139 E.01288
G1 X103.14 Y93.861 E.24939
G1 X100.661 Y93.861 E.07216
G1 X104.139 Y97.339 E.14316
G1 X104.139 Y100.405 E.08919
G1 X97.665 Y102.139 E.19503
G1 X95.861 Y102.139 E.05251
G1 X95.861 Y100.335 E.05251
G1 X97.595 Y93.861 E.19503
G1 X96.167 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 5
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X97.595 Y93.861 E-.54276
G1 X97.447 Y94.413 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z5.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z5
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1629
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
M73 P76 R2
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1629
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X103.701 Y95.173 Z5.4 F30000
G1 X103.857 Y93.861 Z5.4
G1 Z5
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1629
G1 X104.139 Y93.861 E.00823
G1 X104.139 Y95.006 E.03333
G1 X95.861 Y97.224 E.24939
G1 X95.861 Y96.435 E.02295
G1 X101.565 Y102.139 E.23472
G1 X100.776 Y102.139 E.02296
G1 X102.994 Y93.861 E.24939
G1 X100.861 Y93.861 E.06208
G1 X104.139 Y97.139 E.13493
G1 X104.139 Y100.551 E.09927
G1 X98.212 Y102.139 E.17857
G1 X95.861 Y102.139 E.06841
G1 X95.861 Y99.788 E.06841
G1 X97.449 Y93.861 E.17857
G1 X96.021 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 5.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X97.449 Y93.861 E-.54276
G1 X97.301 Y94.413 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z5.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z5.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1637
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1637
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X103.823 Y95.189 Z5.6 F30000
G1 X104.003 Y93.861 Z5.6
G1 Z5.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
M73 P77 R2
G1 F1637
G1 X104.139 Y93.861 E.00397
G1 X104.139 Y95.152 E.03759
G1 X95.861 Y97.371 E.24939
G1 X95.861 Y96.235 E.03303
G1 X101.765 Y102.139 E.24295
G1 X100.629 Y102.139 E.03304
G1 X102.848 Y93.861 E.24939
G1 X101.061 Y93.861 E.052
G1 X104.139 Y96.939 E.1267
G1 X104.139 Y100.698 E.10935
G1 X98.758 Y102.139 E.16211
G1 X95.861 Y102.139 E.08431
G1 X95.861 Y99.242 E.08431
G1 X97.303 Y93.861 E.16211
G1 X95.874 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 5.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X97.303 Y93.861 E-.54276
G1 X97.155 Y94.413 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z5.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z5.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1630
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1630
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X101.786 Y102.139 Z5.8 F30000
G1 Z5.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1630
G1 X100.483 Y102.139 E.03792
G1 X102.701 Y93.861 E.24939
G1 X101.261 Y93.861 E.04192
G1 X104.139 Y96.739 E.11847
G1 X104.139 Y95.299 E.04192
G1 X95.861 Y97.517 E.24939
G1 X95.861 Y96.035 E.04311
G1 X101.965 Y102.139 E.25118
G1 X104.139 Y102.139 E.06328
G1 X104.139 Y100.844 E.0377
G1 X99.304 Y102.139 E.14565
G1 X95.861 Y102.139 E.10021
G1 X95.861 Y98.696 E.10021
M73 P78 R2
G1 X97.156 Y93.861 E.14565
G1 X98.584 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 5.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X97.156 Y93.861 E-.54276
G1 X97.008 Y94.413 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z5.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z5.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1566
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1566
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X100.337 Y102.139 Z6 F30000
G1 Z5.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1566
G1 X102.555 Y93.861 E.24939
G1 X101.461 Y93.861 E.03184
G1 X104.139 Y96.539 E.11024
G1 X104.139 Y95.445 E.03184
G1 X95.861 Y97.664 E.24939
; WIPE_START
G1 F16200
G1 X97.792 Y97.146 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y99.577 Z6 F30000
G1 Z5.6
G1 E.8 F1800
G1 F1566
G1 X95.861 Y98.149 E.04156
G1 X97.01 Y93.861 E.12919
G1 X95.861 Y93.861 E.03344
G1 X95.861 Y95.835 E.05746
G1 X102.165 Y102.139 E.25941
G1 X104.139 Y102.139 E.05746
G1 X104.139 Y100.99 E.03344
G1 X99.851 Y102.139 E.12919
G1 X98.423 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 5.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X99.851 Y102.139 E-.54276
G1 X100.403 Y101.991 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
M73 P79 R2
G3 Z6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z5.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1477
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1477
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X103.793 Y102.139 Z6.2 F30000
G1 Z5.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1477
G1 X102.365 Y102.139 E.04156
G1 X95.861 Y95.635 E.26764
G1 X95.861 Y93.861 E.05164
G1 X96.863 Y93.861 E.02918
G1 X95.861 Y97.603 E.11273
G1 X95.861 Y97.81 E.00603
G1 X104.139 Y95.592 E.24939
G1 X104.139 Y96.339 E.02176
G1 X101.661 Y93.861 E.10201
G1 X102.408 Y93.861 E.02176
G1 X100.19 Y102.139 E.24939
G1 X100.397 Y102.139 E.00603
G1 X104.139 Y101.137 E.11273
G1 X104.139 Y99.708 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X104.139 Y101.137 E-.54276
G1 X103.587 Y101.285 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z6.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1466
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1466
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
M73 P80 R2
G1 E-.04 F1800
G1 X103.993 Y102.139 Z6.4 F30000
G1 Z6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1466
G1 X102.565 Y102.139 E.04156
G1 X95.861 Y95.435 E.27587
G1 X95.861 Y93.861 E.04582
G1 X96.717 Y93.861 E.02492
G1 X95.861 Y97.056 E.09627
G1 X95.861 Y97.956 E.02619
G1 X104.139 Y95.738 E.24939
G1 X104.139 Y96.139 E.01168
G1 X101.861 Y93.861 E.09378
G1 X102.262 Y93.861 E.01168
G1 X100.044 Y102.139 E.24939
G1 X100.944 Y102.139 E.02619
G1 X104.139 Y101.283 E.09627
G1 X104.139 Y99.855 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 6.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X104.139 Y101.283 E-.54276
G1 X103.587 Y101.431 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z6.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z6.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1436
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1436
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
M204 S10000
G1 X104.139 Y102.086 F30000
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1436
G1 X104.139 Y102.139 E.00156
G1 X102.765 Y102.139 E.04
G1 X95.861 Y95.235 E.2841
G1 X95.861 Y93.861 E.04
G1 X96.57 Y93.861 E.02066
G1 X95.861 Y96.51 E.07981
G1 X95.861 Y98.103 E.04635
G1 X104.139 Y95.884 E.24939
G1 X104.139 Y95.939 E.0016
G1 X102.061 Y93.861 E.08555
G1 X102.116 Y93.861 E.0016
G1 X99.897 Y102.139 E.24939
G1 X101.49 Y102.139 E.04635
G1 X104.139 Y101.43 E.07981
G1 X104.139 Y100.001 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 6.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
M73 P81 R2
G1 X104.139 Y101.43 E-.54276
G1 X103.587 Y101.578 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z6.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z6.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1462
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1462
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X102.965 Y102.139 Z6.8 F30000
G1 Z6.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1462
G1 X95.861 Y95.035 E.29233
; WIPE_START
G1 F16200
G1 X97.275 Y96.45 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X97.852 Y93.861 Z6.8 F30000
G1 Z6.4
G1 E.8 F1800
G1 F1462
G1 X96.424 Y93.861 E.04156
G1 X95.861 Y95.963 E.06335
G1 X95.861 Y98.249 E.06651
G1 X104.139 Y96.031 E.24939
G1 X104.139 Y95.739 E.00848
G1 X102.261 Y93.861 E.07732
G1 X101.969 Y93.861 E.00848
G1 X99.751 Y102.139 E.24939
G1 X102.036 Y102.139 E.06651
G1 X104.139 Y101.576 E.06335
G1 X104.139 Y100.148 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 6.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X104.139 Y101.576 E-.54276
G1 X103.587 Y101.724 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z6.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z6.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1473
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
M73 P82 R2
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1473
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X103.165 Y102.139 Z7 F30000
G1 Z6.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1473
G1 X95.861 Y94.835 E.30056
; WIPE_START
G1 F16200
G1 X97.275 Y96.25 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X97.706 Y93.861 Z7 F30000
G1 Z6.6
G1 E.8 F1800
G1 F1473
G1 X96.278 Y93.861 E.04156
G1 X95.861 Y95.417 E.04689
G1 X95.861 Y98.396 E.08667
G1 X104.139 Y96.177 E.24939
G1 X104.139 Y95.539 E.01856
G1 X102.461 Y93.861 E.06909
G1 X101.823 Y93.861 E.01856
G1 X99.604 Y102.139 E.24939
G1 X102.583 Y102.139 E.08667
G1 X104.139 Y101.722 E.04689
G1 X104.139 Y100.294 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 6.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X104.139 Y101.722 E-.54276
G1 X103.587 Y101.87 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z7 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z6.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1438
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
M73 P82 R1
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1438
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
M73 P83 R1
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y100.44 Z7.2 F30000
G1 Z6.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1438
G1 X104.139 Y101.869 E.04156
G1 X103.129 Y102.139 E.03043
G1 X103.365 Y102.139 E.00685
G1 X95.861 Y94.635 E.30879
G1 X95.861 Y94.871 E.00685
G1 X96.131 Y93.861 E.03043
G1 X97.56 Y93.861 E.04156
; WIPE_START
G1 F16200
G1 X96.131 Y93.861 E-.54276
G1 X95.983 Y94.413 E-.21724
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y99.97 Z7.2 F30000
G1 Z6.8
G1 E.8 F1800
G1 F1438
G1 X95.861 Y98.542 E.04156
G1 X104.139 Y96.324 E.24939
G1 X104.139 Y95.339 E.02864
G1 X102.661 Y93.861 E.06086
G1 X101.676 Y93.861 E.02864
G1 X99.458 Y102.139 E.24939
G1 X98.03 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 7
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X99.458 Y102.139 E-.54276
G1 X99.606 Y101.587 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z7.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z7
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1410
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1410
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y101.286 Z7.4 F30000
G1 Z7
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1410
G1 X104.139 Y102.139 E.02484
M73 P84 R1
G1 X103.565 Y102.139 E.01673
G1 X95.861 Y94.435 E.31702
G1 X95.861 Y98.688 E.12375
G1 X104.139 Y96.47 E.24939
G1 X104.139 Y95.139 E.03872
G1 X102.861 Y93.861 E.05263
G1 X101.53 Y93.861 E.03872
G1 X99.312 Y102.139 E.24939
G1 X97.883 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 7.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X99.312 Y102.139 E-.54276
G1 X99.46 Y101.587 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z7.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z7.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1465
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1465
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y101.086 Z7.6 F30000
G1 Z7.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1465
G1 X104.139 Y102.139 E.03065
G1 X103.765 Y102.139 E.01091
G1 X95.861 Y94.235 E.32525
G1 X95.861 Y98.835 E.13383
G1 X104.139 Y96.616 E.24939
G1 X104.139 Y94.939 E.0488
G1 X103.061 Y93.861 E.0444
G1 X101.384 Y93.861 E.0488
G1 X99.165 Y102.139 E.24939
G1 X96.19 Y102.139 E.08658
G1 X95.861 Y101.81 E.01355
G1 X95.861 Y100.382 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 7.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y101.81 E-.54276
G1 X96.19 Y102.139 E-.17695
G1 X96.296 Y102.139 E-.04029
; WIPE_END
G1 E-.04 F1800
G17
G3 Z7.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z7.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1479
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1479
M204 S5000
G1 X95.2 Y102.8 E.27933
M73 P85 R1
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y100.886 Z7.8 F30000
G1 Z7.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1479
G1 X104.139 Y102.139 E.03647
G1 X103.965 Y102.139 E.00509
G1 X95.861 Y94.035 E.33348
G1 X95.861 Y98.981 E.14391
G1 X104.139 Y96.763 E.24939
G1 X104.139 Y94.739 E.05888
G1 X103.261 Y93.861 E.03617
G1 X101.237 Y93.861 E.05888
G1 X99.019 Y102.139 E.24939
G1 X96.39 Y102.139 E.0765
G1 X95.861 Y101.61 E.02178
G1 X95.861 Y100.182 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 7.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X95.861 Y101.61 E-.54276
G1 X96.265 Y102.014 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z7.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z7.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1487
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1487
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X102.736 Y102.139 Z8 F30000
G1 Z7.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1487
G1 X104.139 Y102.139 E.04083
G1 X104.139 Y102.114 E.00073
M73 P86 R1
G1 X95.886 Y93.861 E.33964
G1 X101.091 Y93.861 E.15145
G1 X98.872 Y102.139 E.24939
G1 X96.59 Y102.139 E.06642
G1 X95.861 Y101.41 E.03001
G1 X95.861 Y99.128 E.06642
G1 X104.139 Y96.909 E.24939
G1 X104.139 Y94.539 E.06896
G1 X103.461 Y93.861 E.02794
G1 X102.032 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 7.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.461 Y93.861 E-.54276
G1 X103.865 Y94.265 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z7.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1475
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1475
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X102.936 Y102.139 Z8.2 F30000
G1 Z7.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1475
G1 X104.139 Y102.139 E.03501
G1 X104.139 Y101.914 E.00655
G1 X96.086 Y93.861 E.33141
G1 X100.944 Y93.861 E.14137
G1 X98.726 Y102.139 E.24939
G1 X96.79 Y102.139 E.05634
G1 X95.861 Y101.21 E.03824
G1 X95.861 Y99.274 E.05634
G1 X104.139 Y97.056 E.24939
G1 X104.139 Y94.339 E.07904
G1 X103.661 Y93.861 E.01971
G1 X102.232 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.661 Y93.861 E-.54276
M73 P87 R1
G1 X104.065 Y94.265 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z8.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1463
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1463
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X103.136 Y102.139 Z8.4 F30000
G1 Z8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1463
G1 X104.139 Y102.139 E.02919
G1 X104.139 Y101.714 E.01237
G1 X96.286 Y93.861 E.32318
G1 X100.798 Y93.861 E.13129
G1 X98.58 Y102.139 E.24939
G1 X96.99 Y102.139 E.04626
G1 X95.861 Y101.01 E.04647
G1 X95.861 Y99.42 E.04626
G1 X104.139 Y97.202 E.24939
G1 X104.139 Y94.139 E.08912
G1 X103.861 Y93.861 E.01148
G1 X102.432 Y93.861 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 8.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.861 Y93.861 E-.54276
G1 X104.139 Y94.139 E-.14987
G1 X104.139 Y94.317 E-.06737
; WIPE_END
G1 E-.04 F1800
G17
G3 Z8.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z8.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1432
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
M73 P88 R1
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1432
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X102.55 Y102.139 Z8.6 F30000
G1 Z8.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1432
G1 X103.978 Y102.139 E.04156
G1 X104.139 Y101.514 E.01879
G1 X96.486 Y93.861 E.31495
G1 X95.861 Y94.022 E.01879
G1 X95.861 Y95.45 E.04156
; WIPE_START
G1 F16200
G1 X95.861 Y94.022 E-.54276
G1 X96.414 Y93.879 E-.21724
; WIPE_END
G1 E-.04 F1800
G1 X102.08 Y93.861 Z8.6 F30000
G1 Z8.2
G1 E.8 F1800
G1 F1432
G1 X100.651 Y93.861 E.04156
G1 X98.433 Y102.139 E.24939
G1 X97.19 Y102.139 E.03618
G1 X95.861 Y100.81 E.0547
G1 X95.861 Y99.567 E.03618
G1 X104.139 Y97.349 E.24939
G1 X104.139 Y95.92 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 8.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X104.139 Y97.349 E-.54276
G1 X103.587 Y97.496 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z8.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z8.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1443
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1443
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
M73 P89 R1
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X102.404 Y102.139 Z8.8 F30000
G1 Z8.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1443
G1 X103.832 Y102.139 E.04156
G1 X104.139 Y100.992 E.03458
G1 X104.139 Y101.314 E.00939
G1 X96.686 Y93.861 E.30672
G1 X97.008 Y93.861 E.00939
G1 X95.861 Y94.168 E.03457
G1 X95.861 Y95.596 E.04156
; WIPE_START
G1 F16200
G1 X95.861 Y94.168 E-.54276
G1 X96.413 Y94.02 E-.21724
; WIPE_END
G1 E-.04 F1800
G1 X101.933 Y93.861 Z8.8 F30000
G1 Z8.4
G1 E.8 F1800
G1 F1443
G1 X100.505 Y93.861 E.04156
G1 X98.287 Y102.139 E.24939
G1 X97.39 Y102.139 E.0261
G1 X95.861 Y100.61 E.06293
G1 X95.861 Y99.713 E.0261
G1 X104.139 Y97.495 E.24939
G1 X104.139 Y96.067 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 8.6
; LAYER_HEIGHT: 0.200001
; WIPE_START
G1 F16200
G1 X104.139 Y97.495 E-.54276
G1 X103.587 Y97.643 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z8.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z8.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1473
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1473
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
M73 P90 R1
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y101.114 Z9 F30000
G1 Z8.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1473
G1 X96.886 Y93.861 E.29849
; WIPE_START
G1 F16200
G1 X98.3 Y95.275 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y95.743 Z9 F30000
G1 Z8.6
G1 E.8 F1800
G1 F1473
G1 X95.861 Y94.315 E.04156
G1 X97.555 Y93.861 E.05103
G1 X100.359 Y93.861 E.08159
G1 X98.14 Y102.139 E.24939
G1 X97.59 Y102.139 E.01602
G1 X95.861 Y100.41 E.07116
G1 X95.861 Y99.86 E.01602
G1 X104.139 Y97.641 E.24939
G1 X104.139 Y100.445 E.08159
G1 X103.685 Y102.139 E.05104
G1 X102.257 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 8.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.685 Y102.139 E-.54276
G1 X103.833 Y101.587 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z9 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z8.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1460
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1460
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.139 Y100.914 Z9.2 F30000
G1 Z8.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1460
G1 X97.086 Y93.861 E.29026
; WIPE_START
G1 F16200
G1 X98.5 Y95.275 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X95.861 Y95.889 Z9.2 F30000
G1 Z8.8
G1 E.8 F1800
G1 F1460
G1 X95.861 Y94.461 E.04156
G1 X98.101 Y93.861 E.06749
G1 X100.212 Y93.861 E.06143
G1 X97.994 Y102.139 E.24939
G1 X97.79 Y102.139 E.00594
G1 X95.861 Y100.21 E.07939
G1 X95.861 Y100.006 E.00594
G1 X104.139 Y97.788 E.24939
G1 X104.139 Y99.899 E.06143
G1 X103.539 Y102.139 E.0675
G1 X102.111 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 9
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.539 Y102.139 E-.54276
M73 P91 R1
G1 X103.687 Y101.587 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z9.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z9
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1439
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1439
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
M204 S10000
G1 X104.136 Y102.139 F30000
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1439
M73 P91 R0
G1 X104.139 Y100.714 E.04147
G1 X97.286 Y93.861 E.28203
G1 X95.861 Y93.861 E.04147
G1 X95.861 Y94.607 E.02173
G1 X98.648 Y93.861 E.08396
G1 X100.066 Y93.861 E.04127
G1 X97.848 Y102.139 E.24939
G1 X97.99 Y102.139 E.00414
G1 X95.861 Y100.01 E.08762
G1 X95.861 Y100.152 E.00414
G1 X104.139 Y97.934 E.24939
G1 X104.139 Y99.352 E.04127
G1 X103.393 Y102.139 E.08396
G1 X101.964 Y102.139 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 9.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.393 Y102.139 E-.54276
G1 X103.541 Y101.587 E-.21724
; WIPE_END
G1 E-.04 F1800
G17
G3 Z9.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z9.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F1632
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F1632
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.113 Y101.961 Z9.6 F30000
G1 Z9.2
M73 P92 R0
G1 E.8 F1800
; Slow Down Start
; FEATURE: Floating vertical shell
; LINE_WIDTH: 0.388788
G1 F3000;_EXTRUDE_SET_SPEED
G1 X104.087 Y102.087 E.00362
G1 X103.961 Y102.113 E.00362
G1 X96.039 Y102.113 E.22326
G1 X95.913 Y102.087 E.00362
G1 X95.887 Y101.961 E.00362
G1 X95.887 Y94.039 E.22326
G1 X95.913 Y93.913 E.00362
G1 X96.039 Y93.887 E.00362
G1 X103.961 Y93.887 E.22326
G1 X104.087 Y93.913 E.00362
G1 X104.113 Y94.039 E.00362
G1 X104.113 Y101.901 E.22157
; Slow Down End
; WIPE_START
G1 X104.113 Y99.901 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X101.914 Y101.782 Z9.6 F30000
G1 Z9.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.4
G1 F1632
G1 X103.342 Y101.782 E.04156
G1 X103.782 Y100.139 E.0495
G1 X103.782 Y100.157 E.00053
G1 X97.843 Y94.218 E.2444
G1 X97.861 Y94.218 E.00052
G1 X96.218 Y94.658 E.0495
G1 X96.218 Y96.086 E.04156
; WIPE_START
G1 F16200
G1 X96.218 Y94.658 E-.54276
G1 X96.77 Y94.51 E-.21724
; WIPE_END
G1 E-.04 F1800
G1 X101.252 Y94.218 Z9.6 F30000
G1 Z9.2
G1 E.8 F1800
G1 F1632
G1 X99.824 Y94.218 E.04156
G1 X97.797 Y101.782 E.22787
G1 X97.833 Y101.782 E.00104
G1 X96.218 Y100.167 E.06646
G1 X96.218 Y100.203 E.00104
G1 X103.782 Y98.176 E.22787
G1 X103.782 Y96.748 E.04156
; CHANGE_LAYER
; Z_HEIGHT: 9.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F16200
G1 X103.782 Y98.176 E-.54276
G1 X103.23 Y98.324 E-.21725
; WIPE_END
G1 E-.04 F1800
G17
G3 Z9.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z9.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F2704
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
M73 P93 R0
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F2704
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.144 Y95.239 Z9.8 F30000
G1 X104.295 Y94.39 Z9.8
G1 Z9.4
G1 E.8 F1800
; FEATURE: Bridge
; LINE_WIDTH: 0.40986
; LAYER_HEIGHT: 0.4
M106 S255
G1 F3000
G1 X102.493 Y93.907 E.10034
G1 X100.716 Y93.907 E.09551
G1 X104.093 Y94.812 E.18795
G1 X104.093 Y95.288 E.02559
G1 X98.939 Y93.907 E.28682
G1 X97.162 Y93.907 E.09551
G1 X104.093 Y95.764 E.3857
G1 X104.093 Y96.24 E.02559
G1 X95.907 Y94.047 E.45556
G1 X95.907 Y94.523 E.02559
G1 X104.093 Y96.716 E.45556
G1 X104.093 Y97.192 E.02559
G1 X95.907 Y94.999 E.45556
G1 X95.907 Y95.475 E.02559
G1 X104.093 Y97.668 E.45556
G1 X104.093 Y98.145 E.02559
G1 X95.907 Y95.951 E.45556
G1 X95.907 Y96.427 E.02559
G1 X104.093 Y98.621 E.45556
G1 X104.093 Y99.097 E.02559
G1 X95.907 Y96.903 E.45556
G1 X95.907 Y97.379 E.02559
G1 X104.093 Y99.573 E.45556
G1 X104.093 Y100.049 E.02559
G1 X95.907 Y97.855 E.45556
G1 X95.907 Y98.332 E.02559
G1 X104.093 Y100.525 E.45556
G1 X104.093 Y101.001 E.02559
G1 X95.907 Y98.808 E.45556
G1 X95.907 Y99.284 E.02559
G1 X104.093 Y101.477 E.45556
G1 X104.093 Y101.953 E.02559
G1 X95.907 Y99.76 E.45556
G1 X95.907 Y100.236 E.02559
G1 X102.838 Y102.093 E.38572
G1 X101.061 Y102.093 E.09551
G1 X95.907 Y100.712 E.28684
G1 X95.907 Y101.188 E.02559
G1 X99.284 Y102.093 E.18796
G1 X97.508 Y102.093 E.09551
G1 X95.705 Y101.61 E.10035
M106 S252.45
; CHANGE_LAYER
; Z_HEIGHT: 9.6
; LAYER_HEIGHT: 0.200001
; WIPE_START
G1 F3000
G1 X97.508 Y102.093 E-.70937
G1 X97.641 Y102.093 E-.05063
; WIPE_END
G1 E-.04 F1800
G17
G3 Z9.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z9.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F3485
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F3485
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
M73 P94 R0
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X103.574 Y102.3 Z10 F30000
G1 Z9.6
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.40212
G1 F3485
G1 X104.139 Y101.734 E.02342
G1 X104.139 Y101.226 E.01487
G1 X103.226 Y102.139 E.03779
G1 X102.719 Y102.139 E.01487
G1 X104.139 Y100.719 E.05882
G1 X104.139 Y100.211 E.01487
G1 X102.211 Y102.139 E.07985
G1 X101.703 Y102.139 E.01487
G1 X104.139 Y99.703 E.10088
G1 X104.139 Y99.195 E.01487
G1 X101.195 Y102.139 E.1219
G1 X100.687 Y102.139 E.01487
G1 X104.139 Y98.687 E.14293
G1 X104.139 Y98.179 E.01487
G1 X100.179 Y102.139 E.16396
G1 X99.671 Y102.139 E.01487
G1 X104.139 Y97.671 E.18499
G1 X104.139 Y97.163 E.01487
G1 X99.163 Y102.139 E.20601
G1 X98.655 Y102.139 E.01487
G1 X104.139 Y96.655 E.22704
G1 X104.139 Y96.147 E.01487
G1 X98.147 Y102.139 E.24807
G1 X97.639 Y102.139 E.01487
G1 X104.139 Y95.639 E.2691
G1 X104.139 Y95.131 E.01487
G1 X97.131 Y102.139 E.29012
G1 X96.623 Y102.139 E.01487
G1 X104.139 Y94.623 E.31115
G1 X104.139 Y94.115 E.01487
G1 X96.115 Y102.139 E.33218
G1 X95.861 Y102.139 E.00744
G1 X95.861 Y101.886 E.00743
G1 X103.886 Y93.861 E.33219
G1 X103.378 Y93.861 E.01487
G1 X95.861 Y101.378 E.31116
G1 X95.861 Y100.87 E.01487
G1 X102.87 Y93.861 E.29013
G1 X102.362 Y93.861 E.01487
G1 X95.861 Y100.362 E.26911
G1 X95.861 Y99.854 E.01487
G1 X101.854 Y93.861 E.24808
G1 X101.346 Y93.861 E.01487
G1 X95.861 Y99.346 E.22705
G1 X95.861 Y98.838 E.01487
G1 X100.838 Y93.861 E.20602
G1 X100.33 Y93.861 E.01487
G1 X95.861 Y98.33 E.185
G1 X95.861 Y97.822 E.01487
G1 X99.822 Y93.861 E.16397
G1 X99.314 Y93.861 E.01487
G1 X95.861 Y97.314 E.14294
G1 X95.861 Y96.806 E.01487
G1 X98.806 Y93.861 E.12191
G1 X98.298 Y93.861 E.01487
G1 X95.861 Y96.298 E.10089
G1 X95.861 Y95.79 E.01487
G1 X97.79 Y93.861 E.07986
G1 X97.282 Y93.861 E.01487
G1 X95.861 Y95.282 E.05883
G1 X95.861 Y94.774 E.01487
G1 X96.774 Y93.861 E.0378
G1 X96.266 Y93.861 E.01487
G1 X95.7 Y94.426 E.02343
; CHANGE_LAYER
; Z_HEIGHT: 9.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15000
G1 X96.266 Y93.861 E-.30412
G1 X96.774 Y93.861 E-.19303
G1 X96.285 Y94.35 E-.26285
; WIPE_END
G1 E-.04 F1800
G17
G3 Z10 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.443 Y102.443
G1 Z9.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.39999
G1 F3478
G1 X95.557 Y102.443 E.25855
G1 X95.557 Y93.557 E.25855
G1 X104.443 Y93.557 E.25855
G1 X104.443 Y98 E.12927
G1 X104.443 Y102.383 E.12753
G1 X104.8 Y102.8 F30000
; FEATURE: Outer wall
G1 F3478
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
; WIPE_START
G1 F12000
M204 S10000
M73 P95 R0
G1 X102.8 Y102.753 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X104.153 Y95.241 Z10.2 F30000
G1 X104.3 Y94.426 Z10.2
G1 Z9.8
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.40212
G1 F3478
G1 X103.734 Y93.861 E.02342
G1 X103.226 Y93.861 E.01487
G1 X104.139 Y94.774 E.03779
G1 X104.139 Y95.282 E.01487
G1 X102.719 Y93.861 E.05882
G1 X102.211 Y93.861 E.01487
G1 X104.139 Y95.79 E.07985
G1 X104.139 Y96.298 E.01487
G1 X101.703 Y93.861 E.10088
G1 X101.195 Y93.861 E.01487
G1 X104.139 Y96.805 E.1219
G1 X104.139 Y97.313 E.01487
G1 X100.687 Y93.861 E.14293
G1 X100.179 Y93.861 E.01487
G1 X104.139 Y97.821 E.16396
G1 X104.139 Y98.329 E.01487
G1 X99.671 Y93.861 E.18499
G1 X99.163 Y93.861 E.01487
G1 X104.139 Y98.837 E.20601
G1 X104.139 Y99.345 E.01487
G1 X98.655 Y93.861 E.22704
G1 X98.147 Y93.861 E.01487
G1 X104.139 Y99.853 E.24807
G1 X104.139 Y100.361 E.01487
G1 X97.639 Y93.861 E.2691
G1 X97.131 Y93.861 E.01487
G1 X104.139 Y100.869 E.29013
G1 X104.139 Y101.377 E.01487
G1 X96.623 Y93.861 E.31115
G1 X96.115 Y93.861 E.01487
G1 X104.139 Y101.885 E.33218
G1 X104.139 Y102.139 E.00744
G1 X103.886 Y102.139 E.00743
G1 X95.861 Y94.114 E.33219
G1 X95.861 Y94.622 E.01487
G1 X103.378 Y102.139 E.31116
G1 X102.87 Y102.139 E.01487
G1 X95.861 Y95.13 E.29013
G1 X95.861 Y95.638 E.01487
G1 X102.362 Y102.139 E.26911
G1 X101.854 Y102.139 E.01487
G1 X95.861 Y96.146 E.24808
G1 X95.861 Y96.654 E.01487
G1 X101.346 Y102.139 E.22705
G1 X100.838 Y102.139 E.01487
G1 X95.861 Y97.162 E.20602
G1 X95.861 Y97.67 E.01487
G1 X100.33 Y102.139 E.185
G1 X99.822 Y102.139 E.01487
G1 X95.861 Y98.178 E.16397
G1 X95.861 Y98.686 E.01487
G1 X99.314 Y102.139 E.14294
G1 X98.806 Y102.139 E.01487
M73 P96 R0
G1 X95.861 Y99.194 E.12191
G1 X95.861 Y99.702 E.01487
G1 X98.298 Y102.139 E.10088
G1 X97.79 Y102.139 E.01487
G1 X95.861 Y100.21 E.07986
G1 X95.861 Y100.718 E.01487
G1 X97.282 Y102.139 E.05883
G1 X96.774 Y102.139 E.01487
G1 X95.861 Y101.226 E.0378
G1 X95.861 Y101.734 E.01487
G1 X96.426 Y102.3 E.02343
; CHANGE_LAYER
; Z_HEIGHT: 10
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15000
G1 X95.861 Y101.734 E-.30412
G1 X95.861 Y101.226 E-.19303
G1 X96.35 Y101.715 E-.26285
; WIPE_END
G1 E-.04 F1800
G17
G3 Z10.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END

; OBJECT_ID: 15
G1 X104.8 Y102.8
G1 Z10
G1 E.8 F1800
; FEATURE: Outer wall
; LINE_WIDTH: 0.39999
G1 F3445
M204 S5000
G1 X95.2 Y102.8 E.27933
G1 X95.2 Y93.2 E.27933
G1 X104.8 Y93.2 E.27933
G1 X104.8 Y98 E.13966
G1 X104.8 Y102.74 E.13792
M204 S10000
G1 X103.935 Y102.657 F30000
; FEATURE: Top surface
; LINE_WIDTH: 0.40029
G1 F3445
M204 S2000
G1 X104.497 Y102.095 E.02314
G1 X104.497 Y101.59 E.01472
G1 X103.59 Y102.497 E.03733
G1 X103.085 Y102.497 E.01472
G1 X104.497 Y101.085 E.05815
G1 X104.497 Y100.579 E.01472
G1 X102.579 Y102.497 E.07896
G1 X102.074 Y102.497 E.01472
G1 X104.497 Y100.074 E.09977
G1 X104.497 Y99.568 E.01472
G1 X101.568 Y102.497 E.12059
G1 X101.063 Y102.497 E.01472
G1 X104.497 Y99.063 E.1414
G1 X104.497 Y98.558 E.01472
G1 X100.558 Y102.497 E.16222
G1 X100.052 Y102.497 E.01472
G1 X104.497 Y98.052 E.18303
G1 X104.497 Y97.547 E.01472
G1 X99.547 Y102.497 E.20384
G1 X99.041 Y102.497 E.01472
G1 X104.497 Y97.041 E.22466
G1 X104.497 Y96.536 E.01472
G1 X98.536 Y102.497 E.24547
G1 X98.031 Y102.497 E.01472
G1 X104.497 Y96.031 E.26629
G1 X104.497 Y95.525 E.01472
G1 X97.525 Y102.497 E.2871
G1 X97.02 Y102.497 E.01472
G1 X104.497 Y95.02 E.30791
G1 X104.497 Y94.514 E.01472
G1 X96.514 Y102.497 E.32873
G1 X96.009 Y102.497 E.01472
G1 X104.497 Y94.009 E.34954
G1 X104.497 Y93.504 E.01472
G1 X95.504 Y102.497 E.37036
G1 X95.504 Y101.991 E.01471
G1 X103.991 Y93.504 E.34956
G1 X103.486 Y93.504 E.01472
G1 X95.504 Y101.486 E.32874
G1 X95.504 Y100.98 E.01472
G1 X102.981 Y93.504 E.30793
G1 X102.475 Y93.504 E.01472
G1 X95.504 Y100.475 E.28711
G1 X95.504 Y99.97 E.01472
G1 X101.97 Y93.504 E.2663
G1 X101.464 Y93.504 E.01472
G1 X95.504 Y99.464 E.24549
G1 X95.504 Y98.959 E.01472
G1 X100.959 Y93.504 E.22467
G1 X100.454 Y93.504 E.01472
G1 X95.504 Y98.454 E.20386
G1 X95.504 Y97.948 E.01472
G1 X99.948 Y93.504 E.18304
G1 X99.443 Y93.504 E.01472
G1 X95.504 Y97.443 E.16223
G1 X95.504 Y96.937 E.01472
G1 X98.937 Y93.504 E.14142
G1 X98.432 Y93.504 E.01472
G1 X95.504 Y96.432 E.1206
G1 X95.504 Y95.927 E.01472
G1 X97.927 Y93.504 E.09979
G1 X97.421 Y93.504 E.01472
G1 X95.504 Y95.421 E.07897
G1 X95.504 Y94.916 E.01472
G1 X96.916 Y93.504 E.05816
G1 X96.41 Y93.504 E.01472
G1 X95.504 Y94.41 E.03735
G1 X95.504 Y93.905 E.01472
G1 X96.066 Y93.343 E.02315
; close powerlost recovery
M1003 S0
; WIPE_START
G1 F12000
M204 S10000
G1 X95.504 Y93.905 E-.30208
G1 X95.504 Y94.41 E-.19205
G1 X95.998 Y93.916 E-.26587
; WIPE_END
G1 E-.04 F1800
M106 S0
M981 S0 P20000 ; close spaghetti detector
; FEATURE: Custom
; MACHINE_END_GCODE_START
;===== date: 20240528 =====================
M400 ; wait for buffer to clear
G92 E0 ; zero the extruder
G1 E-0.8 F1800 ; retract
G1 Z10.5 F900 ; lower z a little
G1 X65 Y245 F12000 ; move to safe pos
G1 Y265 F3000

G1 X65 Y245 F12000
G1 Y265 F3000
M140 S0 ; turn off bed
M106 S0 ; turn off fan
M106 P2 S0 ; turn off remote part cooling fan
M106 P3 S0 ; turn off chamber cooling fan

G1 X100 F12000 ; wipe
; pull back filament to AMS
M620 S255
G1 X20 Y50 F12000
G1 Y-3
T255
G1 X65 F12000
G1 Y265
G1 X100 F12000 ; wipe
M621 S255
M104 S0 ; turn off hotend

M622.1 S1 ; for prev firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
    M400 ; wait all motion done
    M991 S0 P-1 ;end smooth timelapse at safe pos
    M400 S3 ;wait for last picture to be taken
M623; end of "timelapse_record_flag"

M400 ; wait all motion done
M17 S
M17 Z0.4 ; lower z motor current to reduce impact if there is something in the bottom

    G1 Z110 F600
    G1 Z108

M400 P100
M17 R ; restore z current

M220 S100  ; Reset feedrate magnitude
M201.2 K1.0 ; Reset acc magnitude
M73.2   R1.0 ;Reset left time magnitude
M1002 set_gcode_claim_speed_level : 0
;=====printer finish  sound=========
M17
M400 S1
M1006 S1
M1006 A0 B20 L100 C37 D20 M40 E42 F20 N60
M1006 A0 B10 L100 C44 D10 M60 E44 F10 N60
M1006 A0 B10 L100 C46 D10 M80 E46 F10 N80
M1006 A44 B20 L100 C39 D20 M60 E48 F20 N60
M1006 A0 B10 L100 C44 D10 M60 E44 F10 N60
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N60
M1006 A0 B10 L100 C39 D10 M60 E39 F10 N60
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N60
M1006 A0 B10 L100 C44 D10 M60 E44 F10 N60
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N60
M1006 A0 B10 L100 C39 D10 M60 E39 F10 N60
M1006 A0 B10 L100 C0 D10 M60 E0 F10 N60
M1006 A0 B10 L100 C48 D10 M60 E44 F10 N100
M1006 A0 B10 L100 C0 D10 M60 E0 F10  N100
M1006 A49 B20 L100 C44 D20 M100 E41 F20 N100
M1006 A0 B20 L100 C0 D20 M60 E0 F20 N100
M1006 A0 B20 L100 C37 D20 M30 E37 F20 N60
M1006 W

M17 X0.8 Y0.8 Z0.5 ; lower motor current to 45% power
M960 S5 P0 ; turn off logo lamp
M73 P100 R0
; EXECUTABLE_BLOCK_END

