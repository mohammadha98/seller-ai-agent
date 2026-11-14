import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type UiSkeletonShape = 'line' | 'rect' | 'circle';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  template: '',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-skeleton--line]': "shape === 'line'",
    '[class.ui-skeleton--rect]': "shape === 'rect'",
    '[class.ui-skeleton--circle]': "shape === 'circle'",
    '[class.ui-skeleton--animated]': 'animated',
    '[style.width]': 'width',
    '[style.height]': "shape === 'circle' ? width : height",
    'aria-hidden': 'true',
  },
})
export class UiSkeletonComponent {
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() shape: UiSkeletonShape = 'line';
  @Input({ transform: booleanAttribute }) animated = true;
}
