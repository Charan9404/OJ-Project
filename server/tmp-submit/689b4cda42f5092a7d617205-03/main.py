def binary_search():
    n = int(input())
    arr = list(map(int, input().split()))
    target = int(input())
    
    left, right = 0, n - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            print(mid)
            return
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    print(-1)

binary_search()