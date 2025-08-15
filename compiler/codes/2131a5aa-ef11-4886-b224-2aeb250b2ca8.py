n = int(input())  # Read the length of array
nums = list(map(int, input().split()))  # Read the array
target = int(input())  # Read the target sum

# Two-pointer technique to find pair that sums to target
def find_two_sum(nums, target):
    num_dict = {}  # val -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_dict:
            return [num_dict[complement], i]
        num_dict[num] = i
    return []  # No solution found

# Get and print result
result = find_two_sum(nums, target)
print(f"{result[0]} {result[1]}")