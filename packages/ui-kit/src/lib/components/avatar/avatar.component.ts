import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type UiAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type UiAvatarShape = 'circle' | 'square';
export type UiAvatarStatus = 'online' | 'away' | 'busy' | 'offline';

const STATUS_LABELS: Record<UiAvatarStatus, string> = {
  online: 'Online',
  away: 'Away',
  busy: 'Busy',
  offline: 'Offline',
};

@Component({
  selector: 'ui-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-avatar--xs]': "size === 'xs'",
    '[class.ui-avatar--sm]': "size === 'sm'",
    '[class.ui-avatar--md]': "size === 'md'",
    '[class.ui-avatar--lg]': "size === 'lg'",
    '[class.ui-avatar--xl]': "size === 'xl'",
    '[class.ui-avatar--circle]': "shape === 'circle'",
    '[class.ui-avatar--square]': "shape === 'square'",
  },
})
export class UiAvatarComponent {
  @Input() alt = '';
  @Input() name: string | null = null;
  @Input() size: UiAvatarSize = 'md';
  @Input() shape: UiAvatarShape = 'circle';
  @Input() status: UiAvatarStatus | null = null;

  protected imageFailed = false;
  private source: string | null = null;

  @Input()
  set src(value: string | null | undefined) {
    this.source = value ?? null;
    this.imageFailed = false;
  }

  get src(): string | null {
    return this.source;
  }

  protected get initials(): string {
    const name = this.name?.trim();
    if (!name) {
      return '';
    }
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    const first = parts[0].charAt(0);
    const last = parts[parts.length - 1].charAt(0);
    return `${first}${last}`.toUpperCase();
  }

  protected onImageError(): void {
    this.imageFailed = true;
  }

  protected statusLabel(): string | null {
    return this.status ? STATUS_LABELS[this.status] : null;
  }
}
