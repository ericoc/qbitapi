#!/usr/bin/env python3
'''pyplay'''


def main():
    '''main()'''
    try:
        x = int(input("What's x? "))
        print(x, "squared is", square(x))
    except ValueError:
        print("That's not a valid number!")


def square(n):
    '''square()'''
    return n * n


# run
main()
