#!/bin/zsh

# Elexive Documentation Standardization Helper
# This script helps maintain consistent documentation structure across component documentation files
# Usage: ./standardize_docs.sh [component_file.md]

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directory with Markdown files
RESOURCES_DIR="/Users/rolle/git/elexive-calc/resources"

# Default template file
TEMPLATE_FILE="$RESOURCES_DIR/StreamlinedComponentTemplate.md"
MAIN_DOC="$RESOURCES_DIR/CalculatorApp.md"

# Skip these files
SKIP_FILES=("plan.md" "DesignGuidelines.md" "ComponentTemplate.md" "StreamlinedComponentTemplate.md" 
            "CalculatorApp.md" "ComponentHierarchy.md" "ComponentMigrationPlan.md" 
            "DocumentationStandardizationProgress.md")

# Function to check if a file should be skipped
should_skip() {
  local file=$(basename "$1")
  for skip_file in "${SKIP_FILES[@]}"; do
    if [[ "$file" == "$skip_file" ]]; then
      return 0
    fi
  done
  return 1
}

# Help message
function show_help {
  echo -e "${BLUE}Elexive Documentation Standardization Helper${NC}"
  echo ""
  echo "Usage:"
  echo "  ./standardize_docs.sh [options] [component_file.md]"
  echo ""
  echo "Options:"
  echo "  -h, --help      Show this help message"
  echo "  -c, --check     Check if component follows the template structure"
  echo "  -v, --verify    Verify all components against the template structure"
  echo "  -l, --list      List all component documentation files"
  echo "  -u, --update    Update the status in ComponentMigrationPlan.md"
  echo "  -a, --all       Process all component files"
  echo ""
  echo "Examples:"
  echo "  ./standardize_docs.sh ModuleSelector.md   # Create template for new standardization"
  echo "  ./standardize_docs.sh --check ModuleSelector.md   # Check if component follows template"
  echo "  ./standardize_docs.sh --verify   # Verify all components"
  echo "  ./standardize_docs.sh --list     # List all component documentation files"
  echo "  ./standardize_docs.sh --update ModuleSelector.md   # Update migration status"
  echo "  ./standardize_docs.sh --all      # Process all component files"
}

# Function to verify all components
function verify_all_components {
  echo -e "${BLUE}Verifying all component documentation files...${NC}"
  local compliant_count=0
  local total_count=0
  
  for file in "$RESOURCES_DIR"/*.md; do
    # Skip files in the SKIP_FILES array
    if should_skip "$file"; then
      continue
    fi
    
    echo -e "${BLUE}Checking $(basename $file)...${NC}"
    if check_template_structure "$file"; then
      ((compliant_count++))
    fi
    ((total_count++))
  done
  
  echo ""
  echo -e "${BLUE}Verification complete:${NC}"
  echo -e "${GREEN}$compliant_count/$total_count components follow the template structure${NC}"
  
  if [ $compliant_count -eq $total_count ]; then
    echo -e "${GREEN}All components are compliant!${NC}"
  else
    echo -e "${YELLOW}$(($total_count-$compliant_count)) components need to be updated${NC}"
  fi
}

# Function to list all component documentation files
function list_component_files {
  echo -e "${BLUE}Available component documentation files:${NC}"
  for file in "$RESOURCES_DIR"/*.md; do
    # Skip files in the SKIP_FILES array
    if should_skip "$file"; then
      continue
    fi
    
    local basename=$(basename "$file")
    if check_template_structure "$file" > /dev/null; then
      echo -e "${GREEN}✓ $basename${NC}"
    else
      echo -e "${RED}✗ $basename${NC}"
    fi
  done
}

# Function to update migration status
function update_migration_status {
  local file=$1
  local basename=$(basename "$file")
  local today=$(date +"%b %d, %Y")
  
  # Check if the file follows the template
  if ! check_template_structure "$file" > /dev/null; then
    echo -e "${RED}Cannot update status: $basename does not follow the template structure${NC}"
    return 1
  fi
  
  # Update ComponentMigrationPlan.md
  if grep -q "$basename.*Pending" "$RESOURCES_DIR/ComponentMigrationPlan.md"; then
    sed -i '' "s/$basename.*Pending/$basename \| Medium \| $today \| ✅ Complete/g" "$RESOURCES_DIR/ComponentMigrationPlan.md"
    echo -e "${GREEN}Updated status of $basename to Complete in ComponentMigrationPlan.md${NC}"
  else
    echo -e "${YELLOW}$basename is not found or already marked as Complete in ComponentMigrationPlan.md${NC}"
  fi
  
  # Update DocumentationStandardizationProgress.md
  if ! grep -q "$basename.*|" "$RESOURCES_DIR/DocumentationStandardizationProgress.md"; then
    # Find the migration progress table and add this component
    sed -i '' "/Migration Progress/,/See the/s/\(.*\)See the/| $basename | $today | Updated via script |\n\n\1See the/" "$RESOURCES_DIR/DocumentationStandardizationProgress.md"
    echo -e "${GREEN}Added $basename to DocumentationStandardizationProgress.md${NC}"
  else
    echo -e "${YELLOW}$basename is already in DocumentationStandardizationProgress.md${NC}"
  fi
}

# Function to process a single component file
function process_component_file {
  local file=$1
  
  # Check if it already follows the template
  if check_template_structure "$file" > /dev/null; then
    echo -e "${GREEN}$(basename $file) already follows the template structure${NC}"
    return 0
  fi
  
  # Create a backup
  cp "$file" "$file.bak"
  echo -e "${BLUE}Created backup at $file.bak${NC}"
  
  # Get the component name
  component_name=$(basename "$file" .md)
  
  # Read the first few lines to extract metadata
  title=$(head -1 "$file" | sed 's/# //')
  status=$(grep -A 2 '> \*\*Status\*\*' "$file" | head -1 | sed 's/> \*\*Status\*\*: //')
  last_updated=$(grep -A 2 '> \*\*Last Updated\*\*' "$file" | head -1 | sed 's/> \*\*Last Updated\*\*: //')
  keywords=$(grep -A 2 '> \*\*AI Keywords\*\*' "$file" | head -1 | sed 's/> \*\*AI Keywords\*\*: //')
  
  # Read the Overview section
  overview=$(sed -n '/^## Overview/,/^## /p' "$file" | grep -v "^## Overview" | grep -v "^## " | sed '/^$/d' | sed 's/^//')
  
  echo -e "${BLUE}Creating template for $component_name...${NC}"
  echo -e "${YELLOW}You'll need to manually fill in the following sections:${NC}"
  echo -e "  - Component-Specific Features"
  echo -e "  - Implementation Highlights"
  echo -e "  - Integration Points"
  echo -e "  - Related Components"
  
  cat << EOF > "$file.new"
# $title

> **Status**: $status  
> **Last Updated**: $last_updated  
> **AI Keywords**: $keywords

## Overview

$overview

> **Note:** This component is part of the [Elexive Solution Builder](./CalculatorApp.md) and adheres to the [Design Guidelines](./DesignGuidelines.md).

## Component-Specific Features

1. **Feature One**
   - Description point
   - Description point
   - Description point
   - Description point

2. **Feature Two**
   - Description point
   - Description point
   - Description point
   - Description point

3. **Feature Three**
   - Description point
   - Description point
   - Description point
   - Description point

4. **Feature Four**
   - Description point
   - Description point
   - Description point
   - Description point

## Implementation Highlights

### Implementation Area One

The component implements a specialized approach:

- Point one
- Point two
- Point three
- Point four

### Implementation Area Two

The component implements another specialized approach:

- Point one
- Point two
- Point three
- Point four

## Integration Points

- **Integration Point One**: Description of how it integrates
- **Integration Point Two**: Description of how it integrates
- **Integration Point Three**: Description of how it integrates
- **Integration Point Four**: Description of how it integrates

## Related Components

- [Related Component One](./RelatedComponentOne.md): Description of relationship
- [Related Component Two](./RelatedComponentTwo.md): Description of relationship
- [Related Component Three](./RelatedComponentThree.md): Description of relationship
- [Related Component Four](./RelatedComponentFour.md): Description of relationship

**Note:** For comprehensive documentation of the Elexive Solution Builder, including the overall application architecture and user journey, see the [main application documentation](./CalculatorApp.md).
EOF

  echo -e "${GREEN}Created template at $file.new${NC}"
  echo -e "${YELLOW}Review the template and rename it to $file when ready${NC}"
  echo -e "${BLUE}TIP: You can extract 'Component-Specific Features' from the existing 'Core Functionality' and 'Strategic Purpose' sections${NC}"
}

# Function to process all component files
function process_all_components {
  echo -e "${BLUE}Processing all component documentation files...${NC}"
  for file in "$RESOURCES_DIR"/*.md; do
    # Skip files in the SKIP_FILES array
    if should_skip "$file"; then
      echo -e "${YELLOW}Skipping $(basename $file)${NC}"
      continue
    fi
    
    process_component_file "$file"
  done
}

# Main logic
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  show_help
  exit 0
elif [[ "$1" == "-c" || "$1" == "--check" ]]; then
  if [[ -z "$2" ]]; then
    echo -e "${RED}Error: Please specify a component file to check${NC}"
    show_help
    exit 1
  fi
  check_template_structure "$RESOURCES_DIR/$2"
  exit $?
elif [[ "$1" == "-v" || "$1" == "--verify" ]]; then
  verify_all_components
  exit 0
elif [[ "$1" == "-l" || "$1" == "--list" ]]; then
  list_component_files
  exit 0
elif [[ "$1" == "-u" || "$1" == "--update" ]]; then
  if [[ -z "$2" ]]; then
    echo -e "${RED}Error: Please specify a component file to update status${NC}"
    show_help
    exit 1
  fi
  update_migration_status "$RESOURCES_DIR/$2"
  exit $?
elif [[ "$1" == "-a" || "$1" == "--all" ]]; then
  process_all_components
  exit 0
elif [[ -z "$1" ]]; then
  echo -e "${RED}Error: Please specify a component file or option${NC}"
  show_help
  exit 1
else
  # If it's just a file name, process that component
  if [[ ! -f "$RESOURCES_DIR/$1" ]]; then
    echo -e "${RED}Error: File $1 does not exist in $RESOURCES_DIR${NC}"
    exit 1
  fi
  
  process_component_file "$RESOURCES_DIR/$1"
  exit 0
fi
  
  echo "Processing $file"
  
  # Extract component name from filename
  filename=$(basename "$file")
  component_name=${filename%.md}
  
  # Extract existing content sections
  overview=$(grep -A 10 "^## Overview" "$file" | grep -v "^## " | grep -v "^$" | head -n 3)
  strategic_purpose=$(grep -A 20 "^## Strategic Purpose" "$file" | grep -v "^## " | grep -v "^$" | head -n 10)
  core_functionality=$(grep -A 40 -E "^## Core Functionality|^## Content Structure Implementation" "$file" | grep -v "^## " | grep -v "^$" | head -n 30)
  design_decisions=$(grep -A 100 "^## Component-Specific Design Decisions" "$file" | grep -v "^## " | grep -v "^$" | head -n 80)
  
  # Create temporary file with standardized structure
  temp_file=$(mktemp)
  
  cat > "$temp_file" << EOF
<!-- filepath: $file -->
# $component_name Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: [Add relevant keywords]

## Overview

$overview

> **Note:** This component adheres to the [Elexive Calculator Design Guidelines](./DesignGuidelines.md) for visual design, interaction patterns, and customer journey integration.

## Strategic Purpose

$strategic_purpose

## Core Functionality

$core_functionality

## Component-Specific Design Decisions

$design_decisions

## Technical Implementation

### Props

- \`[propName]\`: [Description of prop and its purpose]
- \`[propName]\`: [Description of prop and its purpose]

### Component Structure

1. **[Component Section 1]**
   - [Implementation detail]
   - [Implementation detail]

2. **[Component Section 2]**
   - [Implementation detail]
   - [Implementation detail]

### Integration Points

- **[Integration with Component X]**: [Description of how they interact]
- **[Integration with Component Y]**: [Description of how they interact]

## Related Components

- [Related Component 1](./RelatedComponent1.md): [Brief description of relationship]
- [Related Component 2](./RelatedComponent2.md): [Brief description of relationship]
EOF

  # Replace the original file with the standardized version
  mv "$temp_file" "$file"
  
  echo "Standardized $file"
done

echo "Done standardizing component documentation files"
