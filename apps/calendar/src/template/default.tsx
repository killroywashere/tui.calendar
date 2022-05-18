import { Fragment, h } from 'preact';

import { cls } from '@src/helpers/css';
import { getDayName } from '@src/helpers/dayName';
import type EventModel from '@src/model/eventModel';
import type TZDate from '@src/time/date';
import { isSameDate, leadingZero, toFormat } from '@src/time/datetime';
import { stripTags } from '@src/utils/dom';
import { capitalize } from '@src/utils/string';
import { isNil, isPresent } from '@src/utils/type';

import type { EventCategory } from '@t/events';
import type {
  Template,
  TemplateCurrentTime,
  TemplateMonthDayName,
  TemplateMonthGrid,
  TemplateMoreTitleDate,
  TemplateTimezone,
  TemplateWeekDayName,
} from '@t/template';

const SIXTY_MINUTES = 60;

export const templates: Template = {
  milestone(model: EventModel) {
    const classNames = cls('icon', 'ic-milestone');

    return (
      <Fragment>
        <span className={classNames} />
        <span
          style={{
            backgroundColor: model.bgColor,
          }}
        >
          {stripTags(model.title)}
        </span>
      </Fragment>
    );
  },

  milestoneTitle() {
    return <span className={cls('left-content')}>Milestone</span>;
  },

  task(model: EventModel) {
    return `#${model.title}`;
  },

  taskTitle() {
    return <span className={cls('left-content')}>Task</span>;
  },

  alldayTitle() {
    return <span className={cls('left-content')}>All Day</span>;
  },

  allday(model: EventModel) {
    return stripTags(model.title);
  },

  time(model: EventModel) {
    const { start, title } = model;

    if (start) {
      return (
        <span>
          <strong>{toFormat(start, 'HH:mm')}</strong>&nbsp;<span>{stripTags(title)}</span>
        </span>
      );
    }

    return stripTags(title);
  },

  goingDuration(model: EventModel) {
    const { goingDuration } = model;
    const hour = Math.floor(goingDuration / SIXTY_MINUTES);
    const minutes = goingDuration % SIXTY_MINUTES;

    return `GoingTime ${leadingZero(hour, 2)}:${leadingZero(minutes, 2)}`;
  },

  comingDuration(model: EventModel) {
    const { comingDuration } = model;
    const hour = Math.floor(comingDuration / SIXTY_MINUTES);
    const minutes = comingDuration % SIXTY_MINUTES;

    return `ComingTime ${leadingZero(hour, 2)}:${leadingZero(minutes, 2)}`;
  },

  monthMoreTitleDate(moreTitle: TemplateMoreTitleDate) {
    const { date, day } = moreTitle;

    const classNameDay = cls('more-title-date');
    const classNameDayLabel = cls('more-title-day');
    const dayName = capitalize(getDayName(day));

    return (
      <Fragment>
        <span className={classNameDay}>{date}</span>
        <span className={classNameDayLabel}>{dayName}</span>
      </Fragment>
    );
  },

  monthMoreClose() {
    return '';
  },

  monthGridHeader(model: TemplateMonthGrid) {
    const date = parseInt(model.date.split('-')[2], 10);
    const classNames = cls('weekday-grid-date', { 'weekday-grid-date-decorator': model.isToday });

    return <span className={classNames}>{date}</span>;
  },

  monthGridHeaderExceed(hiddenEvents: number) {
    const className = cls('weekday-grid-more-events');

    return <span className={className}>{hiddenEvents} more</span>;
  },

  monthGridFooter(_model: TemplateMonthGrid) {
    return '';
  },

  monthGridFooterExceed(_hiddenEvents: number) {
    return '';
  },

  monthDayname(model: TemplateMonthDayName) {
    return model.label;
  },

  weekDayname(model: TemplateWeekDayName) {
    const classDate = cls('dayname-date');
    const className = cls('dayname-name');

    return (
      <Fragment>
        <span className={classDate}>{model.date}</span>&nbsp;&nbsp;
        <span className={className}>{model.dayName}</span>
      </Fragment>
    );
  },

  weekGridFooterExceed(hiddenEvents: number) {
    return `+${hiddenEvents}`;
  },

  dayGridTitle(viewName: EventCategory) {
    if (viewName === 'milestone') {
      return templates.milestoneTitle();
    }

    if (viewName === 'task') {
      return templates.taskTitle();
    }

    if (viewName === 'allday') {
      return templates.alldayTitle();
    }

    return viewName;
  },

  event(model: EventModel) {
    const { category } = model;
    if (category === 'milestone') {
      return templates.milestone(model);
    }

    if (category === 'task') {
      return templates.task(model);
    }

    if (category === 'allday') {
      return templates.allday(model);
    }

    if (category === 'time') {
      return templates.time(model);
    }

    return model.title;
  },

  collapseBtnTitle() {
    const className = cls('collapse-btn-icon');

    return <span className={className} />;
  },

  timezoneDisplayLabel({ displayLabel, timezoneOffset }: TemplateTimezone) {
    if (isNil(displayLabel) && isPresent(timezoneOffset)) {
      const sign = timezoneOffset < 0 ? '-' : '+';
      const hours = Math.abs(timezoneOffset / SIXTY_MINUTES);
      const minutes = Math.abs(timezoneOffset % SIXTY_MINUTES);

      return `GMT${sign}${leadingZero(hours, 2)}:${leadingZero(minutes, 2)}`;
    }

    return displayLabel as string;
  },

  timegridDisplayPrimaryTime(props: TemplateCurrentTime) {
    const { time } = props;

    return toFormat(time, 'hh tt');
  },

  timegridDisplayTime(props: TemplateCurrentTime) {
    const { time } = props;

    return toFormat(time, 'HH:mm');
  },

  timegridCurrentTime(timezone: TemplateCurrentTime) {
    const { time, format = 'HH:mm' } = timezone;

    return toFormat(time, format);
  },

  popupIsAllday() {
    return 'All day';
  },

  popupStateFree() {
    return 'Free';
  },

  popupStateBusy() {
    return 'Busy';
  },

  titlePlaceholder() {
    return 'Subject';
  },

  locationPlaceholder() {
    return 'Location';
  },

  startDatePlaceholder() {
    return 'Start date';
  },

  endDatePlaceholder() {
    return 'End date';
  },

  popupSave() {
    return 'Save';
  },

  popupUpdate() {
    return 'Update';
  },

  popupEdit() {
    return 'Edit';
  },

  popupDelete() {
    return 'Delete';
  },

  popupDetailDate(isAllday: boolean, start: TZDate, end: TZDate) {
    const isSame = isSameDate(start, end);
    const endFormat = `${isSame ? '' : 'YYYY.MM.DD '}hh:mm tt`;

    if (isAllday) {
      return `${toFormat(start, 'YYYY.MM.DD')}${isSame ? '' : ` - ${toFormat(end, 'YYYY.MM.DD')}`}`;
    }

    return `${toFormat(start, 'YYYY.MM.DD hh:mm tt')} - ${toFormat(end, endFormat)}`;
  },

  popupDetailLocation({ location }) {
    return location;
  },

  popupDetailUser({ attendees = [] }) {
    return attendees.join(', ');
  },

  popupDetailState({ state }) {
    return state || 'Busy';
  },

  popupDetailRepeat({ recurrenceRule }) {
    return recurrenceRule;
  },

  popupDetailBody({ body }) {
    return body;
  },
};

export type TemplateName = keyof Template;
