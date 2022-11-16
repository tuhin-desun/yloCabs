import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    backgroundColor: '#eaeaea',
    flex: 1,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  button: {
    color: '#fff',
    borderRadius: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc000',
    height: 30
  },
  round_icon_buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    margin: 16,
  },
  upi_icon_containers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  upi_icons_text: {
    fontSize: 12,
    width: 100,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  upi_app_not_found: {
    fontSize: 14,
    justifyContent: 'center',
    alignContent: 'center',
  },
  upi_image: {
    width: 50,
    height: 50,
  },
  response_text: {
    margin: 16,
    fontSize: 14,
  },
});