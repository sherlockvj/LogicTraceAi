export const savedSnippets = [
    {
        title: "Dijkstra's Algorithm (Python)",
        language: "python",
        code: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        current_distance, current_node = heapq.heappop(pq)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances`,
        explanation: "### 1. **Overview**\nThis code implements Dijkstra's algorithm to find the shortest path from a starting node to all other nodes in a weighted graph. It uses a priority queue to efficiently manage the nodes being processed.\n\n---\n\n### 2. **Explanation**\n- **Input**: \n  - `graph`: A dictionary where each key is a node, and the value is another dictionary representing its neighbors and the weights of the edges to those neighbors.\n  - `start`: The starting node for the algorithm.\n\n- **Initialization**:\n  - `distances`: A dictionary initialized with infinite (`float('inf')`) distances for all nodes, except the starting node, which is set to 0.\n  - `pq`: A priority queue (min-heap) initialized with a tuple `(0, start)` representing the starting node and its distance (0).\n\n- **Main Loop**:\n  - While the priority queue is not empty:\n    1. Extract the node with the smallest distance (`current_distance, current_node`) using `heapq.heappop()`.\n    2. If the extracted distance is greater than the recorded distance for the current node, skip further processing for this node (it has already been processed with a shorter path).\n    3. Iterate over the neighbors of the current node:\n       - Calculate the tentative distance to the neighbor (`distance = current_distance + weight`).\n       - If this distance is smaller than the currently recorded distance for the neighbor:\n         - Update the neighbor's distance in the `distances` dictionary.\n         - Push the neighbor and its updated distance into the priority queue using `heapq.heappush()`.\n\n- **Output**:\n  - Returns the `distances` dictionary, which contains the shortest distance from the starting node to every other node in the graph.\n\n---\n\n### 3. **Usage**\n- **Practical Applications**:\n  - Finding the shortest path in road networks (e.g., GPS navigation systems).\n  - Network routing protocols to determine the most efficient data transmission paths.\n  - Game development for pathfinding in maps or grids.\n\n- **Example**:\n  - Input graph:\n    ```python\n    graph = {\n        'A': {'B': 1, 'C': 4},\n        'B': {'A': 1, 'C': 2, 'D': 6},\n        'C': {'A': 4, 'B': 2, 'D': 3},\n        'D': {'B': 6, 'C': 3}\n    }\n    ```\n  - Starting node: `'A'`\n  - Output: `{'A': 0, 'B': 1, 'C': 3, 'D': 6}`\n\n---\n\n### Imported Method Explanation\n- **`heapq`**: Provides an efficient implementation of a priority queue using a binary heap. Used here for managing nodes by their shortest known distance.",
        mermaidCode: "graph TD\nstart[\"Start\"] --> init_distances[\"Initialize distances dictionary\"]\ninit_distances --> set_start_distance[\"Set start node distance to 0\"]\nset_start_distance --> init_pq[\"Initialize priority queue with start node\"]\ninit_pq --> while_pq[\"While priority queue is not empty\"]\nwhile_pq --> pop_pq[\"Pop node with smallest distance from priority queue\"]\npop_pq --> check_distance[\"Check if current distance is greater than stored distance\"]\ncheck_distance --> continue_loop[\"Continue loop if true\"]\ncheck_distance --> iterate_neighbors[\"Iterate over neighbors of current node\"]\niterate_neighbors --> calculate_distance[\"Calculate new distance\"]\ncalculate_distance --> compare_distance[\"Compare new distance with stored distance\"]\ncompare_distance --> update_distance[\"Update distance if new distance is smaller\"]\nupdate_distance --> push_pq[\"Push neighbor and new distance to priority queue\"]\npush_pq --> iterate_neighbors\ncompare_distance --> iterate_neighbors\ncontinue_loop --> while_pq\nwhile_pq --> return_distances[\"Return distances dictionary\"]\nreturn_distances --> end_node[\"End\"]"
    },
    {
        title: "Binary Search (JavaScript)",
        language: "javascript",
        code: `function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}`,
        explanation: "### 1. **Overview**\nThis code implements the binary search algorithm to efficiently find the index of a target value in a sorted array. If the target is not found, it returns `-1`.\n\n---\n\n### 2. **Explanation**\n- **Initialization**: \n  - Two pointers, `left` and `right`, are initialized to represent the start (`0`) and end (`arr.length - 1`) of the array.\n  \n- **Loop**:\n  - A `while` loop runs as long as `left` is less than or equal to `right`. This ensures the search continues until the target is found or the search space is exhausted.\n  \n- **Midpoint Calculation**:\n  - The midpoint index, `mid`, is calculated using `(left + right) / 2`, rounded down with `Math.floor()`.\n\n- **Comparison**:\n  - If the value at `arr[mid]` equals the `target`, the function returns the `mid` index.\n  - If `arr[mid]` is less than the `target`, the search space is narrowed to the right half by updating `left` to `mid + 1`.\n  - If `arr[mid]` is greater than the `target`, the search space is narrowed to the left half by updating `right` to `mid - 1`.\n\n- **Return Value**:\n  - If the loop exits without finding the target, the function returns `-1` to indicate the target is not in the array.\n\n---\n\n### 3. **Usage**\n- **Practical Applications**:\n  - Searching for a specific value in large, sorted datasets (e.g., finding a name in a sorted list or a number in a sorted array).\n  - Used in algorithms where efficient searching is required, such as database indexing or solving competitive programming problems.\n\n- **Key Requirements**:\n  - The input array (`arr`) must be sorted for the binary search to work correctly.\n  \nThis function is efficient with a time complexity of **O(log n)**, making it ideal for large datasets.",
        mermaidCode: "graph TD\nstart[\"Start\"] --> init_vars[\"Initialize left = 0, right = arr.length - 1\"]\ninit_vars --> while_check[\"left <= right\"]\nwhile_check -->|true| calc_mid[\"Calculate mid = Math.floor((left + right) / 2)\"]\ncalc_mid --> if_equal[\"arr[mid] === target\"]\nif_equal -->|true| return_mid[\"Return mid\"]\nif_equal -->|false| if_less[\"arr[mid] < target\"]\nif_less -->|true| update_left[\"left = mid + 1\"]\nupdate_left --> while_check\nif_less -->|false| update_right[\"right = mid - 1\"]\nupdate_right --> while_check\nwhile_check -->|false| return_neg1[\"Return -1\"]\nreturn_neg1 --> end_node[\"End\"]\nreturn_mid --> end_node"
    }
];