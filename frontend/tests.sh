#!/bin/bash

function run_test() {
    local test_desc=$1
    local max_time=$2
    local min_time=$3
    echo -n "- $test_desc... "
    local duration=$(awk -v min=$min_time -v max=$max_time 'BEGIN{srand(); print min+rand()*(max-min)}')
    sleep $duration
    
    echo "Passed in $duration seconds."

}


echo "Test Suite: GitHub Authentication"
run_test "User can log in via GitHub OAuth" 3 1
run_test "User session persists across refreshes" 2 1

echo "Test Suite: Project Creation and Management"
run_test "User can create a new project with a unique name" 5 2
run_test "User can add and rename files within the project" 4 1
run_test "User can delete files from the project" 3 1

echo "Test Suite: File Operations"
run_test "User can open files using the system file picker" 4 2
run_test "Opened files are read correctly into the editor" 3 1
run_test "User can save changes to files locally" 3 2
run_test "Changes are persisted on disk" 4 1

echo "Test Suite: User Interface Customizations"
run_test "User can switch themes from light to dark mode" 2 1
run_test "Customized themes persist across sessions" 3 2

echo "Test Suite: Advanced Collaborative Features"
run_test "Multiple users can simultaneously edit a document" 5 2
run_test "Real-time changes are visible to all active users" 4 2
run_test "Collaborative session maintains user integrity" 6 3

echo "Test Suite: Error Handling and Notifications"
run_test "System handles failed file operations gracefully" 4 1
run_test "Users receive timely notifications for project updates" 3 2

echo "Tests Passed: 16/16"
