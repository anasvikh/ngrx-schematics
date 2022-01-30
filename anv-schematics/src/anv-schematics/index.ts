import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function addAction(_options: any): Rule {
  console.log('test!');
  return (tree: Tree, _context: SchematicContext) => {
    const actionsPath = `/test/store/actions/${_options.module}.actions.ts`;

    const importsTemplate = `import { createAction, props } from '@ngrx/store';`;
    const actionTypeTemplate = `export const ${_options.action.toUpperCase()}_${_options.property.toUpperCase()} = '[App ${_options.module}] ${capitalizeFirstLetter(_options.action)} ${_options.property}';`
    const actionTemplate = `export const ${_options.action}${capitalizeFirstLetter(_options.property)} = createAction(${_options.action.toUpperCase()}_${_options.property.toUpperCase()}${_options.payload ? ', props<{ payload: any }>()' : ''});`

    if (!tree.exists(actionsPath)) {
      tree.create(actionsPath, `${importsTemplate}\n\n${actionTypeTemplate}\n\n${actionTemplate}`);
    } else {
      let actionsBuffer = tree.read(actionsPath);
      if (actionsBuffer != null) {
        const lineArray = actionsBuffer?.toString()
          .split('\n');
        const firstActionLine = lineArray
          .findIndex(value => value.match(/export const ([a-z])/g));

        lineArray.splice(firstActionLine - 1, 0, `${actionTypeTemplate}`);
        let newActions = `${lineArray.join('\n')}\n${actionTemplate}`;
        tree.overwrite(actionsPath, newActions);
      }
    }
    return tree;
  };
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
