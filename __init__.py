#!/usr/bin/env python3
'''pyplay'''


def main():
    '''main()'''
    x = int(input("What's x? "))
    print("x squared is", square(x))


def square(n):
    '''square()'''
    return n * n


# run
main()
