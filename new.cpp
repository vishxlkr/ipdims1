#include <bits/stdc++.h>
using namespace std;

int getTimeToStabilize(string pipeline, char failedService) {
    int n = pipeline.size();
    vector<int> timeToRemove(n, 0); // time each node will be removed
    stack<int> st; // indices of failedService

    for (int i = 0; i < n; ++i) {
        if (pipeline[i] == failedService) {
            if (!st.empty()) {
                // Propagate backward
                int prevIndex = st.top() - 1;
                while (prevIndex >= 0 && pipeline[prevIndex] != failedService && timeToRemove[prevIndex] == 0) {
                    timeToRemove[prevIndex] = timeToRemove[prevIndex + 1] + 1;
                    prevIndex--;
                }
            }
            st.push(i);
        }
    }

    // The answer is the maximum time any node is removed
    int maxTime = 0;
    for (int t : timeToRemove) {
        maxTime = max(maxTime, t);
    }
    return maxTime;
}

int main() {
    cout << "Sample 0: " << getTimeToStabilize("acebbbb", 'b') << endl; // 3
    cout << "Sample 1: " << getTimeToStabilize("database", 'a') << endl; // 2
    cout << "Sample 2: " << getTimeToStabilize("abac", 'a') << endl; // 2
    cout << "Sample 3: " << getTimeToStabilize("abcde", 'x') << endl; // 0
    return 0;
}
