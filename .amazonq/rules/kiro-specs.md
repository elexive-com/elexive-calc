# Specification-Driven Development Guidelines

This document describes guidelines on how to leverage the specs concept of Kiro. Specs are structured markdown files that formalize the development process for complex features. They provide a systematic approach to transform high-level ideas into detailed implementation plans with clear tracking and accountability.

## Core Concept

Specs consist of three key files that form the foundation of each specification:

- requirements.md - Captures user stories and acceptance criteria in structured EARS notation
- design.md - Documents technical architecture, sequence diagrams, and implementation considerations
- tasks.md - Provides a detailed implementation plan with discrete, trackable tasks

### Workflow

Specs can be either created by Kiro itself of by Amazon Q Developer. The workflow to create and use specs consists of the following phases:

1. Requirements Phase: Define user stories and acceptance criteria in structured EARS notation
2. Design Phase: Document the technical architecture, sequence diagrams, and implementation considerations
3. Implementation Planning: Break down the work into discrete, trackable tasks with clear descriptions and outcomes
4. Execution Phase: Track progress as tasks are completed, with the ability to update and refine the spec as needed

### Requirements

The `requirements.md` file is written in the form of user stories with acceptance criteria in EARS (Easy Approach to Requirements Syntax) notation.

```
WHEN [condition/event]
THE SYSTEM SHALL [expected behavior]
```

For example:

```
WHEN a user submits a form with invalid data
THE SYSTEM SHALL display validation errors next to the relevant fields
```

This is how the `requirements.md` file is structured:

```
# Requirements Document

## Introduction

Summary / Overview

## Requirements

### Requirements 1:
**User Story:** As <persona>, I want ..., so that I...

### Acceptance Criteria
1. WHEN [condition/event] THE SYSTEM SHALL [expected behavior]
2. WHEN [condition/event] THE SYSTEM SHALL [expected behavior]
...

### Requirements 2:
**User Story:** As <persona>, I want ..., so that I...

### Acceptance Criteria
1. WHEN [condition/event] THE SYSTEM SHALL [expected behavior]
2. WHEN [condition/event] THE SYSTEM SHALL [expected behavior]

```

### Design

The `design.md` file is where technical architecture, sequence diagrams, and implementation considerations are documented. It captures the big picture of how the system will work, including the components and their interactions.

### Implementation Plan

The `tasks.md` file provides a detailed implementation plan with discrete, trackable tasks and sub-tasks. Each task is clearly defined, with a clear description, expected outcome, and any necessary resources or dependencies. Engineering teams and AI assistants that make use of specs, will use this file to track progress.

This is how the `tasks.md` file is structured:

```
# Implementation Plan

- [ ] 1. description of task 1
    - implementation step 1
    - implementation step 2
    - implementation step n
    - _Requirements: 1.1, 1.5, 3.1, 3.2_ (comma separated list of related requirements)
- [ ] 1. description of task 2
    - implementation step 1
    - implementation step 2
    - implementation step n
    - _Requirements: 1.1, 1.5, 2,2, 4.3_ (comma separated list of related requirements)
...
```