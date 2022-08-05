#include <iostream>
#include <chrono>
#include <fstream>
#include "pieces.h"

int pieceLens[12] = {5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 3, 4};
int rotationLens[12] = {1, 4, 8, 8, 4, 8, 8, 4, 8, 2, 4, 1};
bool usedPieces[12] = {};
int remainingPieces = 12;

int board[10][10];

std::chrono::_V2::system_clock::time_point start = std::chrono::high_resolution_clock::now();

void printBoard()
{
    for (int r = 0; r < 10; r++)
    {
        for (int c = 0; c < 10; c++)
        {
            std::cout << board[r][c] << ", ";
            ;
        }
        std::cout << std::endl;
    }
    std::cout << std::endl;
}

bool canAddPiece(int piece, int rotation, int row, int col)
{
    if (usedPieces[piece])
        return false;
    for (int coord = 0; coord < pieceLens[piece]; coord++)
    {
        int currRow = pieces[piece][rotation][coord][0] + row;
        int currCol = pieces[piece][rotation][coord][1] + col;
        if (currRow < 0 || currCol < 0 || currRow + currCol >= 10)
            return false;
        if (board[currRow][currCol] > -1)
            return false;
    }
    return true;
}

void addPiece(int piece, int rotation, int row, int col)
{
    for (int coord = 0; coord < pieceLens[piece]; coord++)
    {
        int currRow = pieces[piece][rotation][coord][0] + row;
        int currCol = pieces[piece][rotation][coord][1] + col;
        board[currRow][currCol] = piece;
    }
    usedPieces[piece] = true;
    remainingPieces--;
}

void removePiece(int piece, int rotation, int row, int col)
{
    for (int coord = 0; coord < pieceLens[piece]; coord++)
    {
        int currRow = pieces[piece][rotation][coord][0] + row;
        int currCol = pieces[piece][rotation][coord][1] + col;
        board[currRow][currCol] = -1;
    }
    usedPieces[piece] = false;
    remainingPieces++;
}

char res[100000][10][10];
int resLen = 0;
int i = 0;

void generateAll()
{
    // std::cout << "i: " << i << std::endl;
    // if (i >= 4)
    // {
    //     std::cout << "i: " << i << std::endl;
    //     printBoard();
    //     std::cout << std::endl;
    // }
    // printBoard();
    // std::cout << std::endl;
    if (i == 81)
    {
        for (int r = 0; r < 10; r++)
            for (int c = 0; c < 10; c++)
                res[resLen][r][c] = board[r][c];
        resLen++;
        std::chrono::_V2::system_clock::time_point now = std::chrono::high_resolution_clock::now();
        double totalSeconds = std::chrono::duration_cast<std::chrono::milliseconds>(now - start).count() / 1000.0;
        std::cout << "res len: " << resLen << ", total seconds: " << totalSeconds << ", average ways per second: " << resLen / totalSeconds << std::endl;
        return;
    }
    int row = i / 10;
    int col = i % 10;
    if (row + col >= 10 || board[row][col] > -1)
    {
        i++;
        generateAll();
        i--;
        return;
    }
    // std::cout << "row: " << row << ", col: " << col << std::endl;
    i++;
    for (int piece = 0; piece < 12; piece++)
    {
        for (int rot = 0; rot < rotationLens[piece]; rot++)
        {
            // std::cout << "piece: " << piece << ", rot: " << rot << std::endl;
            // std::cout << "can add piece: " << canAddPiece(piece, rot, row, col) << std::endl;
            // if (canAddPiece(piece, rot, row, col))
            // {
            //     std::cout << "can add piece\n";
            //     std::cout << "piece: " << piece << ", rot: " << rot << ", row: " << row << ", col: " << col << std::endl;
            // }
            if (!canAddPiece(piece, rot, row, col))
                continue;
            addPiece(piece, rot, row, col);
            generateAll();
            removePiece(piece, rot, row, col);
        }
    }
    i--;
}

bool visited[10][10] = {};

std::pair<int, int> getBestPos()
{
    for (int i = 0; i < 10; i++)
        for (int j = 0; j < 10; j++)
            visited[i][j] = false;
    int bestLen = 100;
    std::pair<int, int> bestPos = {10, 10};
    for (int r = 0; r < 10; r++)
    {
        for (int c = 0; c <10; c++)
        {
            int curr = 0;
            while (curr + r < 10 && curr + c < 10)
            {
                int lastRow = curr + r;
                int lastCol = curr + c;
                for (int currRow = r; currRow <= lastRow; currRow++)
                {
                    if (currRow + lastCol >= 10)
                        goto nxt;
                    if (board[currRow][lastCol] > -1)
                        goto nxt;
                }
                for (int currCol = c; currCol < lastCol; currCol++)
                {
                    if (lastRow + currCol >= 10)
                        goto nxt;
                    if (board[lastRow][currCol] > -1)
                        goto nxt;
                }
                for (int currRow = r; currRow <= lastRow; currRow++)
                {
                    visited[currRow][lastCol] = true;
                }
                for (int currCol = c; currCol < lastCol; currCol++)
                {
                    visited[lastRow][currCol] = true;
                }
                curr++;
            }
        nxt:
            if (curr < bestLen)
            {
                bestLen = curr;
                bestPos.first = r;
                bestPos.second = c;
            }
        }
    }
    return bestPos;
}

void generateAll2()
{
    if (!remainingPieces)
    {
        for (int r = 0; r < 10; r++)
            for (int c = 0; c < 10; c++)
                res[resLen][r][c] = board[r][c];
        resLen++;
        return;
    }
    std::pair<int, int> bestPos = getBestPos();
    for (int piece = 0; piece < 12; piece++)
    {
        if (usedPieces[piece])
            continue;
        for (int rot = 0; rot < rotationLens[piece]; rot++)
        {
            for (int coord = 0; coord < pieceLens[piece]; coord++)
            {
                int currRow = bestPos.first - pieces[piece][rot][coord][0];
                int currCol = bestPos.second - pieces[piece][rot][coord][1];
                if (!canAddPiece(piece, rot, currRow, currCol))
                    continue;
                addPiece(piece, rot, bestPos.first, bestPos.second);
                generateAll2();
                removePiece(piece, rot, bestPos.first, bestPos.second);
            }
        }
    }
}

// void generateAllIteratively(int *, st, int pt)
// {
//     while (pt >= 0)
//     {
//         if (pt == 81)
//         {
//             for (int i = 0; i < 9; i++)
//                 for (int j = 0; j < 9; j++)
//                     res[resLen][i][j] = board[i][j];
//             resLen++;
//             pt--;
//             continue;
//         }
//         int piece = st[pt] /
//         if (st[pt] >= 480)
//         {
//             st[pt--] = 0;
//             continue;
//         }
//         int currRow = pt / 9;
//         int currCol = pt % 9;
//         if (currRow + currCol >= 9) {
//             st[pt++]++;
//             continue;
//         }
//     }
// }

int main()
{

    for (int r = 0; r < 10; r++)
    {
        for (int c = 0; c < 10; c++)
        {
            board[r][c] = -1;
        }
    }
    generateAll();
    std::ofstream resFile("res");
    resFile << "{";
    for (int i = 0; i < resLen; i++)
    {
        resFile << "{";
        for (int r = 0; r < 10; r++)
        {
            resFile << "{";
            for (int c = 0; c < 10; c++)
            {
                resFile << std::to_string(res[i][r][c]);
                if (c < 9)
                    resFile << ",";
            }
            resFile << "}";
            if (r < 9)
                resFile << ",";
        }
        resFile << "}";
        if (i < resLen - 1)
            resFile << ",";
    }
    resFile << "}";
    resFile.close();
}