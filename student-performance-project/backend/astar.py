"""
Experiment 4: A* Search Algorithm
Personalized study path optimization.
"""

import heapq

# Study topics graph (simplified knowledge graph)
# Nodes: study topics, Edges: transitions with effort cost
STUDY_GRAPH = {
    'Fundamentals': {
        'Basic_Concepts': 2,
        'Core_Theory': 3
    },
    'Basic_Concepts': {
        'Practice_Problems': 3,
        'Intermediate_Theory': 4
    },
    'Core_Theory': {
        'Intermediate_Theory': 3,
        'Practice_Problems': 4
    },
    'Intermediate_Theory': {
        'Advanced_Problems': 5,
        'Mock_Tests': 4
    },
    'Practice_Problems': {
        'Mock_Tests': 3,
        'Advanced_Problems': 5
    },
    'Mock_Tests': {
        'Final_Review': 3,
        'Exam_Ready': 2
    },
    'Advanced_Problems': {
        'Exam_Ready': 4
    },
    'Final_Review': {
        'Exam_Ready': 1
    },
    'Exam_Ready': {}
}

# Estimated difficulty/remaining effort to reach Exam_Ready from each node
HEURISTIC = {
    'Fundamentals': 10,
    'Basic_Concepts': 8,
    'Core_Theory': 9,
    'Intermediate_Theory': 6,
    'Practice_Problems': 7,
    'Advanced_Problems': 4,
    'Mock_Tests': 3,
    'Final_Review': 2,
    'Exam_Ready': 0
}

def astar_study_path(start_level, target_level):
    """
    Find optimal study path using A* algorithm.
    
    State representation: current study topic
    Nodes: study topics
    Edges: transitions between topics
    Cost: estimated study effort/time
    Heuristic: estimated remaining difficulty
    """
    
    # Map student level to starting node
    level_to_node = {
        'Beginner': 'Fundamentals',
        'Intermediate': 'Intermediate_Theory',
        'Advanced': 'Advanced_Problems'
    }
    
    start_node = level_to_node.get(start_level, 'Fundamentals')
    goal_node = 'Exam_Ready'
    
    # Priority queue: (f_cost, g_cost, current_node, path)
    open_set = [(HEURISTIC.get(start_node, 0), 0, start_node, [start_node])]
    visited = set()
    
    while open_set:
        f_cost, g_cost, current, path = heapq.heappop(open_set)
        
        if current == goal_node:
            return {
                'path': path,
                'total_cost': g_cost,
                'f_cost': f_cost
            }
        
        if current in visited:
            continue
        visited.add(current)
        
        # Explore neighbors
        if current in STUDY_GRAPH:
            for neighbor, edge_cost in STUDY_GRAPH[current].items():
                if neighbor not in visited:
                    new_g = g_cost + edge_cost
                    h = HEURISTIC.get(neighbor, 0)
                    new_f = new_g + h
                    heapq.heappush(open_set, (new_f, new_g, neighbor, path + [neighbor]))
    
    return {'path': [], 'total_cost': 0, 'f_cost': 0, 'error': 'No path found'}