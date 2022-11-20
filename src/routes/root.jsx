import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, GridItem, Card, CardBody, Link, Image } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"

import { Input } from '@chakra-ui/react'

import evmcrisprImg from '../assets/evmcrispr.png';
import vitalikImg from '../assets/vitalik.png';
import uniswapImg from '../assets/uniswap.png';


export default function Root() {
    const [url, setUrl] = useState('')
    const navigate = useNavigate()

    const handeSubmit = event => {
        event.preventDefault()
        navigate(url)
    }
    return (
      <>
        <Box h='100vh' maxW="800px" margin="auto" display="flex" flexDirection='column' justifyContent="center" alignItems="center">
          <Flex align="center" justify="center">

            <Text
                backgroundColor='#31E1F7'
                bgClip="text"
                fontSize={50}
                fontWeight="normal"
              >
                WaybackMachine
            </Text> 
                        
          </Flex>
          <Flex align="center" justify="center">
            <Text
                backgroundColor='#525252'
                bgClip="text"
                align="center"
                fontSize={16}
                fontWeight="normal"
              >
                The InterPlanetary Wayback Machine allows the user to go back in time and see how ENS linked dApps looked in the past. It also allows to donate in Filecoin to the preservation of those websites.
            </Text> 
          </Flex>
          <Flex align="center" justify="center" mt='30px'>
            <form onSubmit={handeSubmit}>              
              <Flex 
              align="center"
              justify="center"
              backgroundColor='rgba(196, 196, 196, 0.18);'
              borderRadius='30'
              h="80px"
              w='70vw'
              px='45px'
              >
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M34.8948 32.4842L23.533 21.1224C25.2961 18.843 26.2499 16.0562 26.2499 13.1249C26.2499 9.61621 24.8805 6.32622 22.4043 3.84561C19.928 1.36499 16.6293 0 13.1249 0C9.62058 0 6.32185 1.36937 3.84561 3.84561C1.36499 6.32185 0 9.61621 0 13.1249C0 16.6293 1.36937 19.928 3.84561 22.4043C6.32185 24.8849 9.61621 26.2499 13.1249 26.2499C16.0562 26.2499 18.8387 25.2961 21.118 23.5374L32.4799 34.8948C32.5132 34.9282 32.5527 34.9546 32.5963 34.9727C32.6398 34.9907 32.6865 35 32.7336 35C32.7807 35 32.8274 34.9907 32.8709 34.9727C32.9145 34.9546 32.954 34.9282 32.9874 34.8948L34.8948 32.9917C34.9282 32.9584 34.9546 32.9189 34.9727 32.8753C34.9907 32.8318 35 32.7851 35 32.738C35 32.6909 34.9907 32.6442 34.9727 32.6006C34.9546 32.5571 34.9282 32.5175 34.8948 32.4842ZM20.0549 20.0549C18.1999 21.9055 15.7412 22.9249 13.1249 22.9249C10.5087 22.9249 8.04996 21.9055 6.19497 20.0549C4.34436 18.1999 3.32499 15.7412 3.32499 13.1249C3.32499 10.5087 4.34436 8.04559 6.19497 6.19497C8.04996 4.34436 10.5087 3.32499 13.1249 3.32499C15.7412 3.32499 18.2043 4.33998 20.0549 6.19497C21.9055 8.04996 22.9249 10.5087 22.9249 13.1249C22.9249 15.7412 21.9055 18.2043 20.0549 20.0549Z" fill="#130505"/>
                </svg>
                <Input 
                  value={url}
                  backgroundColor='transparent'
                  border='0px'
                  fontSize={20}
                  _focusVisible={{ outline: 'none' }}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder='Enter an ENS URL' 
                />
              </Flex>
              
            </form>
          </Flex>
        <div id="featured-domains" w='70vw'>    
          <Flex align="center" justify="center">          
            <Grid templateColumns='repeat(3, 1fr)' w='70%' mt='80px' gap={6} autoFlow="row dense">    
            <GridItem 
                w='100%'
                bg='blue.500'
                overflow='hidden'
                borderRadius="20px"
                >
                <Link href='./#/evmcrispr.eth'>                                            
                    <Card>
                      <CardBody p='0px'>
                        <Image 
                          src={ evmcrisprImg } 
                          alt='evmscript'
                          w='100%'                         
                        />
                      </CardBody>
                    </Card>                                    
                </Link>
              </GridItem>
              <GridItem 
                w='100%'
                bg='blue.500'
                overflow='hidden'
                borderRadius="20px"
                >
                <Link href='./#/uniswap.eth'>                                            
                    <Card>
                      <CardBody p='0px'>
                        <Image 
                          src={ uniswapImg } 
                          alt='uniswap'
                          w='100%'                         
                        />
                      </CardBody>
                    </Card>
                  
                  
                </Link>
              </GridItem>
              <GridItem 
                w='100%'
                bg='blue.500'
                overflow='hidden'
                borderRadius="20px"
                >
                <Link href='./#/vitalik.eth'>                                            
                    <Card>
                      <CardBody p='0px'>
                        <Image 
                          src={ vitalikImg } 
                          alt='vitalik'
                          w='100%'                         
                        />
                      </CardBody>
                    </Card>
                  
                  
                </Link>
              </GridItem>
              
            </Grid>
          </Flex>
        </div>
        <div id="detail"></div>
        </Box>
        
      </>
    );
  }