# Binary Search Solution
# Read input
n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# Binary search implementation
def binary_search(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Find and print the result
result = binary_search(nums, target)
print(result)
