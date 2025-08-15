n = int(input().strip())
arr = list(map(int, input().split()))
target = int(input().strip())

pos = {}
for i, x in enumerate(arr):
    if target - x in pos:
        print(pos[target - x], i)
        break
    pos[x] = i
