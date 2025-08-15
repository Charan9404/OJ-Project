#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    unordered_map<int, int> map;
    
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            cout << "[" << map[complement] << ", " << i << "]" << endl;
            return 0;
        }
        map[nums[i]] = i;
    }

    cout << "No solution found" << endl;
    return 0;
}
