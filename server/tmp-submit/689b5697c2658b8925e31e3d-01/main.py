n = int(input())            # First line: size of array
nums = list(map(int, input().split()))   # Second line: array elements
target = int(input())       # Third line: target sum

# Find indices where nums[i] + nums[j] = target
for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            # Print exactly in format "i j" as shown in test cases
            print(f"{i} {j}")
            break