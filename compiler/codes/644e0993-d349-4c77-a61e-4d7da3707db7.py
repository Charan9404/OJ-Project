import numpy as np

# Read input
n = int(input())  # number of data points
m = int(input())  # number of features

# Read training data
X = []
y = []
for i in range(n):
    line = list(map(float, input().split()))
    X.append(line[:-1])  # features
    y.append(line[-1])   # target

X = np.array(X)
y = np.array(y)

# Add bias term (intercept)
X = np.column_stack([np.ones(n), X])

# Linear Regression using Normal Equation: θ = (X^T * X)^(-1) * X^T * y
theta = np.linalg.inv(X.T @ X) @ X.T @ y

# Read test data
test_n = int(input())
for i in range(test_n):
    test_x = list(map(float, input().split()))
    test_x = np.array([1] + test_x)  # add bias term
    prediction = test_x @ theta
    print(f"{prediction:.2f}")
