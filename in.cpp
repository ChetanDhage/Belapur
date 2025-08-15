#include <iostream>
#include <string>
#include <vector>
using namespace std;

void dfs(vector<string> &grid, int i, int j, int rows, int cols) {
    if (i < 0 || j < 0 || i >= rows || j >= cols || grid[i][j] != '0')
        return;

    grid[i][j] = '2'; // mark visited
    dfs(grid, i + 1, j, rows, cols);
    dfs(grid, i - 1, j, rows, cols);
    dfs(grid, i, j + 1, rows, cols);
    dfs(grid, i, j - 1, rows, cols);
}

string SearchingChallenge(string strArr[], int arrLength) {
    vector<string> grid(strArr, strArr + arrLength);
    int rows = arrLength;
    int cols = grid[0].size();
    int holes = 0;

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (grid[i][j] == '0') {
                holes++;
                dfs(grid, i, j, rows, cols);
            }
        }
    }

    return to_string(holes);
}

int main(void) {
    string A[] = {"01111", "01010", "00011", "11110"};
    int arrLength = sizeof(A) / sizeof(*A);
    cout << SearchingChallenge(A, arrLength);
    return 0;
}
