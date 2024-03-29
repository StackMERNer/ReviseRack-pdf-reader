import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {primaryColor} from '../utils/colors';
interface Range {
  startDate: Date;
  endDate: Date;
}
interface dateType {
  day: number;
  isToday?: boolean;
  isInRange?: boolean;
  isFirstDate?: boolean;
  isLastDate?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  inactive?: true;
  isBorderInRight?: boolean;
  isRoundedRight?: boolean;
  isRoundedLeft?: boolean;
}
const Calendar = ({ranges = []}: {ranges: Range[]}) => {
  const currentDate = new Date();
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());
  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    let date = new Date();
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
      lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
      lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
      lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    const dates: dateType[] = [];
    for (let i = firstDayofMonth; i > 0; i--) {
      dates.push({day: lastDateofLastMonth - i + 1, inactive: true});
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      let isToday =
        i === date.getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear();

      const targetdate = new Date(`${currYear}-${currMonth + 1}-${i}`);
      let isInRange = false;
      let isRangeStart = false;
      let isRangeEnd = false;
      for (let index = 0; index < ranges.length; index++) {
        const range = ranges[index];
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        const startDateOnlyString = new Date(
          `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        );
        const endDateOnlyString = new Date(
          `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
        );

        if (
          targetdate >= startDateOnlyString &&
          targetdate <= endDateOnlyString
        ) {
          isInRange = true;

          if (
            targetdate.getDate() === start.getDate() &&
            targetdate.getMonth() === start.getMonth()
          ) {
            isRangeStart = true;
          }
          if (
            targetdate.getDate() === end.getDate() &&
            targetdate.getMonth() === end.getMonth()
          ) {
            isRangeEnd = true;
          }
          break;
        }
      }

      const rightRowDateReminder =
        firstDayofMonth !== 0 ? 7 - firstDayofMonth : 0;
      const leftSideRowReminder =
        rightRowDateReminder !== 6 ? rightRowDateReminder + 1 : 0;
      const isInlastOfRow = i % 7 === rightRowDateReminder;
      const isFirstOfRow = i % 7 === leftSideRowReminder;

      const isFirstDate = i === 1;
      const isLastDate = i === lastDateofMonth;
      const shouldAddBorderRight = isInRange && !isInlastOfRow && !isRangeEnd;

      dates.push({
        day: i,
        isFirstDate: isFirstDate,
        isLastDate: isLastDate,
        isInRange: isInRange,
        isRangeEnd: isRangeEnd,
        isRangeStart: isRangeStart,
        isToday: isToday,
        isBorderInRight: shouldAddBorderRight,
        isRoundedLeft: isFirstOfRow,
        isRoundedRight: isInlastOfRow,
        // isRoundedRight: shouldAddBorderRight,
      });
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      dates.push({day: i - lastDayofMonth + 1, inactive: true});
    }
    return dates;
  };

  const handleUpdatingMonth = (method: 'increase' | 'decrease') => {
    if (method === 'increase') {
      const nextMonth = currMonth < 11 ? currMonth + 1 : 0;
      const nextYear = currMonth < 11 ? currYear : currYear + 1;
      setCurrMonth(nextMonth);
      setCurrYear(nextYear);
    } else {
      const prevMonth = currMonth > 0 ? currMonth - 1 : 11;
      const prevYear = currMonth > 0 ? currYear : currYear - 1;
      setCurrMonth(prevMonth);
      setCurrYear(prevYear);
    }
  };

  return (
    <View
      style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => handleUpdatingMonth('decrease')}
              style={styles.arrowButton}>
              <AntDesignIcons name="caretleft" color={'white'} size={15} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{`${
              months[currMonth]
            } ${currYear.toString()}`}</Text>
            <TouchableOpacity
              onPress={() => handleUpdatingMonth('increase')}
              style={styles.arrowButton}>
              <AntDesignIcons name="caretright" color={'white'} size={15} />
            </TouchableOpacity>
          </View>

          {/* Calendar Body */}
          <View style={styles.weekDays}>
            {weekDays.map((week, index) => (
              <Text style={styles.weekDay} key={index}>
                {week}
              </Text>
            ))}
          </View>
          <FlatList
            data={renderCalendar()}
            numColumns={7}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View
                style={[
                  styles.day,
                  item.isInRange && styles.coloredBg,
                  (item.isFirstDate ||
                    item.isRangeStart ||
                    item.isRoundedLeft) &&
                    styles.roundLeft,
                  (item.isRangeEnd || item.isRoundedRight || item.isLastDate) &&
                    styles.roundRight,
                  item.isBorderInRight && styles.borderRight,
                ]}>
                <Text
                  style={[
                    item.isInRange ? styles.textWhite : styles.dayText,
                    item.isToday && styles.today,
                    item.inactive && {color: 'lightgray'},
                  ]}>
                  {item.day.toString()}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '97%',
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 15,
    shadowColor: 'gray',
    borderWidth: 0.2,
    shadowOffset: {width: -2, height: 4},
    marginHorizontal: 'auto',
    marginVertical: 'auto',
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  calendarContainer: {
    width: '98%',
  },
  weekDay: {fontSize: 14, color: 'black'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 35,
    paddingTop: 15,
  },
  arrowButton: {
    padding: 5,
    backgroundColor: primaryColor,
    borderRadius: 6,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  day: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 3,
    marginBottom: 6,
  },
  today: {
    borderBottomWidth: 3,
    borderBottomColor: primaryColor,
  },
  coloredBg: {
    backgroundColor: primaryColor,
  },
  textWhite: {
    color: 'white',
  },
  roundLeft: {
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: 'white',
  },
  roundRight: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },

  dayText: {
    fontSize: 14,
    color: 'black',
    paddingBottom: 2,
  },
});

export default Calendar;
