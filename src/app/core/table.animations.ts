import {
  trigger,
  style,
  state,
  transition,
  animate,
} from '@angular/animations';
import { getStylesFromClasses, stateClassMap } from './animationUtils';

// export const HighlightTrigger = trigger('rowHighlight', [
//   state(
//     'selected',
//     style({
//       backgroundColor: 'lightgreen',
//       fontSize: '20px',
//     })
//   ),
//   state(
//     'notselected',
//     style({
//       // transform: "translateX(-50%)"
//       backgroundColor: 'lightsalmon',
//       fontSize: '12px',
//     })
//   ),
//   transition('selected => notselected', animate('200ms')),
//   transition('notselected => selected', animate('400ms')),
// ]);
export const HighlightTrigger = trigger('rowHighlight', [
  state('selected', style(getStylesFromClasses(stateClassMap['selected']))),
  state(
    'notselected',
    style(getStylesFromClasses(stateClassMap['notselected']))
  ),
  state(
    'void',
    style({
      transform: 'translateX(-50%)',
    })
  ),
  transition('* => notselected', animate('200ms')),
  transition('* => selected', animate('400ms 200ms ease-in')),
  transition('void => *', animate('500ms')),
]);
