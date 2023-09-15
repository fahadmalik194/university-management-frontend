import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  FormErrorMessage
} from "@chakra-ui/react";
import toast, { Toaster } from 'react-hot-toast';
import { Field, Form, Formik } from 'formik';
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/university.jpg";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
// Custom Service
import { post } from "services/httpAuthService";

async function loginAPI({email, password}) {
  if (!email || !password) {
    return;
  }
  try {
    const response = await post("/auth/login", { email, password });
    if (response.code === 200) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userDetail", JSON.stringify(response.data.user));

      toast.success('Login Successful: You are now logged in!');
      setTimeout(() => {
        window.location.href = '/#/admin/default';
      }, 1000);
      return;
    } else {
      let errorMessage;
      if(response.message) errorMessage = 'Login Failed! ' + response.message;
      else errorMessage = 'Login Failed: An error occurred during login.'
      toast.error(errorMessage);
      return;
    }
  } catch (error) {
    let errorMessage;
    if(error.message) errorMessage = 'Login Failed! ' + error.message;
    else errorMessage = 'Login Failed: An error occurred during login.'
    toast.error(errorMessage);
    return;
  }
}

function SignIn() {

  function validateEmail(value){
    let error
    if(!value) {
      error = 'Email is required';
    }
    return error;
  }

  function validatePassword(value){
    let error
    if(!value) {
      error = 'Password is required';
    }
    return error;
  }
  
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Toaster 
        toastOptions={{
          duration: 5000,
          style: {
            width: 10000
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            University Mangement
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}>
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Sign in with Google
          </Button>
          <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              or
            </Text>
            <HSeparator />
          </Flex>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                actions.setSubmitting(false);
                loginAPI(values);
              }, 1000)
            }}
          >
            {(props) => (
              <Form>
                <Field name='email' validate={validateEmail}>
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                      <FormLabel
                        display='flex'
                        ms='4px'
                        fontSize='sm'
                        fontWeight='500'
                        color={textColor}
                        mb='8px'
                      >
                        Email <Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Input 
                        {...field} 
                        placeholder='Enter your email'
                        fontSize='sm'
                        fontWeight='500'
                        ms={{ base: "0px", md: "0px" }}
                        size='lg'
                        color={textColor}
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name='password' validate={validatePassword} >
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.password && form.touched.password}>
                      <FormLabel
                        display='flex'
                        ms='4px'
                        fontSize='sm'
                        fontWeight='500'
                        color={textColor}
                        mb='8px'
                        mt='24px'
                      >
                        Password<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <InputGroup size='md'>
                        <Input 
                          {...field} type={show ? "text" : "password"} 
                          placeholder='Enter your password' 
                          fontSize='sm'
                          fontWeight='500'
                          ms={{ base: "0px", md: "0px" }}
                          size='lg'
                          color={textColor}
                        />
                        <InputRightElement display='flex' alignItems='center' mt='4px'>
                          <Icon
                            color={textColorSecondary}
                            _hover={{ cursor: "pointer" }}
                            as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                            onClick={handleClick}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Flex justifyContent='space-between' align='center' mb='24px' mt='24px'>
                  <FormControl display='flex' alignItems='center'>
                    <Checkbox
                      id='remember-login'
                      colorScheme='brandScheme'
                      me='10px'
                    />
                    <FormLabel
                      htmlFor='remember-login'
                      mb='0'
                      fontWeight='normal'
                      color={textColor}
                      fontSize='sm'>
                      Keep me logged in
                    </FormLabel>
                  </FormControl>
                  <NavLink to=''>
                    <Text
                      color={textColorBrand}
                      fontSize='sm'
                      w='124px'
                      fontWeight='500'>
                      Forgot password?
                    </Text>
                  </NavLink>
                </Flex>
                <Button
                  mt={4}
                  isLoading={props.isSubmitting}
                  type='submit'
                  fontSize='sm'
                  variant='brand'
                  fontWeight='500'
                  w='100%'
                  h='50'
                  mb='24px'
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Not registered yet?
              <NavLink to=''>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Contact Admin Department
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
