import React, { Component } from "react";
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Dimensions, Alert,
    ImageBackground,
    ScrollView,
    ActivityIndicator
} from "react-native";
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import auth from '@react-native-firebase/auth';

class SignupScreen extends Component {

    state = {
        email: '',
        password: '',
        error: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: false,
        isValidUser: true,
        isValidPassword: true,
        pswd_check: true,
        loading: false
    }

    textInputChange = (val) => {
        if (val.length >= 10 && val.endsWith('@gmail.com')) {
            this.setState({
                email: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            this.setState({
                email: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    checkEmail = () => {
        if (!this.state.email.endsWith('@gmail.com')) {
            Alert.alert('Wrong Input!', 'Enter valid email address', [
                { text: 'Okay' }
            ]);
            return;
        }
    }
    handlePasswordChange = (val) => {
        if (val.length >= 6) {
            this.setState({
                password: val,
                isValidPassword: true
            });
        } else {
            this.setState({
                password: val,
                isValidPassword: false
            });
        }
    }

    handleConfirmPasswordChange = (val) => {
        if (val === this.state.password) {
            this.setState({ pswd_check: true, confirm_password: val })
        }
        else {
            this.setState({
                confirm_password: val,
                pswd_check: false
            });
        }
    }

    updateSecureTextEntry = () => {
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        });
    }

    updateConfirmSecureTextEntry = () => {
        this.setState({
            confirm_secureTextEntry: !this.state.confirm_secureTextEntry
        });
    }

    handleValidUser = (val) => {
        if (val.length >= 4) {
            this.setState({
                isValidUser: true
            });
        } else {
            this.setState({
                isValidUser: false
            });
        }
    }

    signUpHandle = () => {

        if (this.state.email == 0 || this.state.password == 0 || this.state.confirm_password == 0) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                { text: 'Okay' }
            ]);
            return;
        }
        if (!this.state.pswd_check) {
            Alert.alert('Wrong Input!', 'Password is not Matching..!', [
                { text: 'Okay' }
            ]);
            return;
        }

        Alert.alert(
            "Confirmation.!",
            "If our team find anything wrong your account can be blocked.",
            [
                {
                    text: "Edit",
                    style: "cancel"
                },
                { text: "Confirm", onPress: this.signUp }
            ],
            { cancelable: false }
        );

    }

    signUp = () => {
        this.setState({ loading: true })

        auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(this.onLoginSuccess)
            .catch(err => {
                this.setState({
                    error: err.message,
                    loading: false
                })
            })
    }

    onLoginSuccess = () => {
        this.setState({
            error: '',
            loading: false
        })
    }



    render() {

        const colors = { text: '#05375a' }

        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/contact-purple-top-right.png')}
                    resizeMode='stretch'
                    style={styles.image2}
                    imageStyle={styles.image2_imageStyle}
                >
                    {/*Login Text */}

                    <View style={styles.view1}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <FontAwesome
                                name="arrow-circle-left"
                                color='#FFF'
                                size={30}
                            />
                        </TouchableOpacity>
                        <Text style={styles.login}>Create Account</Text>
                    </View>

                    {/*Login Form */}


                    <View style={styles.logview}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.text_footer}>Email or Phone</Text>
                            <View style={styles.action}>
                                <FontAwesome
                                    name="user-o"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder="Your Email"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={this.textInputChange}
                                    onEndEditing={this.checkEmail}
                                />
                                {this.state.check_textInputChange ?
                                    <Animatable.View
                                        animation="bounceIn"
                                    >
                                        <Feather
                                            name="check-circle"
                                            color="green"
                                            size={20}
                                        />
                                    </Animatable.View>
                                    : null}
                            </View>

                            <Text style={[styles.text_footer, {
                                marginTop: 10
                            }]}>Password</Text>
                            <View style={styles.action}>
                                <Feather
                                    name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder="Your Password"
                                    secureTextEntry={this.state.secureTextEntry ? true : false}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={this.handlePasswordChange}
                                    onEndEditing={this.handleValidUser}
                                />
                                <TouchableOpacity
                                    onPress={this.updateSecureTextEntry}
                                >
                                    {this.state.secureTextEntry ?
                                        <Feather
                                            name="eye-off"
                                            color="grey"
                                            size={20}
                                        />
                                        :
                                        <Feather
                                            name="eye"
                                            color="grey"
                                            size={20}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>
                            {this.state.isValidPassword ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Password must be 6 characters long.</Text>
                                </Animatable.View>
                            }

                            <Text style={[styles.text_footer, {
                                marginTop: 10
                            }]}>Confirm Password</Text>
                            <View style={styles.action}>
                                <Feather
                                    name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder="Confirm Your Password"
                                    secureTextEntry={this.state.confirm_secureTextEntry ? true : false}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={this.handleConfirmPasswordChange}
                                //   onEndEditing={this.checkpswd}
                                />
                                <TouchableOpacity
                                    onPress={this.updateConfirmSecureTextEntry}
                                >
                                    {this.state.secureTextEntry ?
                                        <Feather
                                            name="eye-off"
                                            color="grey"
                                            size={20}
                                        />
                                        :
                                        <Feather
                                            name="eye"
                                            color="grey"
                                            size={20}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>
                            {this.state.pswd_check ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Password is not matching...!</Text>
                                </Animatable.View>
                            }

                            {this.state.error === '' ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.userErr}>{this.state.error}</Text>
                                </Animatable.View>
                            }

                            {this.state.error == '' ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.userErr}>{this.state.error}</Text>
                                </Animatable.View>
                            }
                            <View style={{
                                alignItems: 'flex-end',

                                padding: 4
                            }}>
                                <View style={styles.textPrivate}>
                                    <Text style={styles.color_textPrivate}>
                                        By signing up you agree to our
                  </Text>
                                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                                    <Text style={styles.color_textPrivate}>{" "}and</Text>
                                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        
                                        width: 100,
                                        padding: 10,
                                        paddingHorizontal: 20,
                                        backgroundColor: '#7133D1',
                                        borderRadius: 20,
                                        shadowColor: "rgba(0,0,0,1)",
                                        shadowOffset: {
                                            height: 5,
                                            width: 5
                                        },
                                        elevation: 5,
                                        shadowOpacity: 0.15,
                                        shadowRadius: 0,
                                    }}
                                    onPress={this.signUpHandle}
                                >
                                    {this.state.loading ? <ActivityIndicator
                                        size='small'
                                        color='#F1FAEE'
                                    /> :
                                        <View style={{

                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={styles.textSign}>Sign UP</Text>
                                            <FontAwesome
                                                name="arrow-circle-right"
                                                color='#FFF'
                                                size={20}
                                                style={{ marginLeft: 5 }}
                                            />
                                        </View>
                                    }

                                </TouchableOpacity>
                            </View>
                            <View style={{
                                alignItems: 'center',
                                marginTop: 5,

                            }}>
                                <Text style={{
                                    fontFamily: "roboto-regular",
                                    color: "rgba(29,53,87,1)",
                                    fontSize: 15
                                }}> Or create account with </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    padding: 10,
                                    width: '100%',
                                    borderTopWidth: 0.5,
                                    borderRadius: 20,
                                    marginTop: 5
                                }}>
                                    <TouchableOpacity style={styles.otherbutton}>
                                        <FontAwesome
                                            name="google"
                                            color='#FFF'
                                            size={20}
                                            style={{ marginLeft: 5 }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.otherbutton, { backgroundColor: '#3cba54' }]}>
                                        <FontAwesome
                                            name="phone"
                                            color='#FFF'
                                            size={20}
                                            style={{ marginLeft: 5 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10
                        }}
                    >
                        <Text style={{
                            fontFamily: "roboto-regular",
                            color: "rgba(29,53,87,1)",
                            fontSize: 15
                        }}>
                            Already have an account?
                       </Text>
                        <Text style={{
                            fontFamily: "roboto-700",
                            color: "rgba(113,51,209,1)",
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}>Log In</Text>
                    </TouchableOpacity>
                </ImageBackground>

            </View>

        );
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image2: {
        flex: 1,
    },
    image2_imageStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.5,
        resizeMode: 'stretch',

    },
    view1: {
        width: '100%',
        marginTop: '10%',
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    login: {
        fontFamily: "alatsi-regular",
        color: "rgba(241,250,238,1)",
        marginLeft: 20,
        fontSize: 30
    },
    logtxt: {
        fontFamily: "alatsi-regular",
        color: "rgba(241,250,238,1)",
        fontSize: 15
    },
    logview: {
        height: '72%',
        width: '80%',
        marginLeft: '10%',
        marginTop: 20,
        backgroundColor: "#FFF",
        // opacity: 0.3,
        borderRadius: 20,
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 20,
            width: 20
        },
        elevation: 5,
        shadowOpacity: 0.5,
        shadowRadius: 0,
        padding: 20,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    textSign: {
        fontFamily: "alatsi-regular",
        color: "rgba(241,250,238,1)",
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    },
    color_textPrivate: {
        color: 'grey',
        fontSize: 8
    },
    otherbutton: {
        padding: 5,
        paddingHorizontal: 25,
        backgroundColor: '#4885ed',
        borderRadius: 10,
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 20,
            width: 20
        },
        elevation: 5,
        shadowOpacity: 0.5,
        shadowRadius: 0,
    }

});

export default SignupScreen;