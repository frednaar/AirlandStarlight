---
sidebar_position: 1
title: Luau
description: Luau is the scripting language creators use in Airland World
---

[Luau](https://luau-lang.org) is a fast, small, safe, gradually typed embeddable scripting language developed by Roblox. It was released as open source in 2021. This documentation has been adapted from the Roblox website, thanks to the Creative Commons Attribution 4.0 International license.

LUAU is default scripting language used in Airland World. Use Luau in scripts to make your experience dynamic and interactive. For a comparison of language features in Luau and C#, see [Luau and C# Comparison](../luau/luau-csharp-comparison.md).

## In-game editor

To code Airland games, you can either use The In Game Editor, available by clicking ???. The editor supports Luau with autocompletion, syntax highlighting, static linting, type checking, and script analysis. It also shows documentation and function signatures for members of the [Airland Engine API](/reference/engine).

## Types

Luau includes the following data types:

- `nil` represents non-existence or nothingness. It's different from any other value or data type.
- [Booleans](../luau/booleans.md), or `bool`, have a value of either `false` or `true`.
- [Numbers](../luau/numbers.md), or `double`, represent double-precision (64-bit) floating-point numbers.
- [Strings](../luau/strings.md) are sequences of characters, such as letters, numbers, and symbols.
- [Tables](../luau/tables.md) are [arrays](../luau/tables.md#arrays) or [dictionaries](../luau/tables.md#dictionaries) of any value except `nil`.
- [Enums](../luau/enums.md) are fixed lists of items.

Luau is dynamically typed by default. Variables, function parameters, and return values can be any data type. This helps you write code faster because you don't need to provide types for each piece of data. You can still declare explicit types for variables in Luau and enable [strict type checking](../luau/type-checking.md) to make type issues obvious and easy to locate.

## Data Structures

You can also implement the following data structures using primitive data types:

- [Stacks](../luau/stacks.md) are Last-In-First-Out collections of items that you can implement using tables.
- [Queues](../luau/queues.md) are First-In-First-Out collections of items that you can implement using tables.
- [Metatables](../luau/metatables.md) are tables with advanced configurations that can achieve functionalities such as storing pairs of keys and values and calculating arithmetic operations.

## Features

In Luau, [variables](../luau/variables.md) and [functions](../luau/functions.md) can have global and local [scope](../luau/scope.md) within a script. Luau has logical, relational, and compound assignment [operators](../luau/operators.md). You can use [control structures](../luau/control-structures.md) and [functions](../luau/functions.md) to control when Luau executes code. Many operators and variable assignments perform [type coercion](../luau/type-coercion.md) to change values to the types that Luau expects.
