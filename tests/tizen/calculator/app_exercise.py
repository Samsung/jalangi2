# Copyright 2013 Samsung Information Systems America, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Author: Manu Sridharan

from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.common.by import By
import time

def exercise(driver):
    # tries 56+23
    element = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.ID, "button5")))
    element.click()
    element = driver.find_element(by=By.ID, value="button6")    
    element.click()
    element = driver.find_element(by=By.ID, value="buttonadd")    
    element.click()
    element = driver.find_element(by=By.ID, value="button2")    
    element.click()
    element = driver.find_element(by=By.ID, value="button3")    
    element.click()
    element = driver.find_element(by=By.ID, value="buttonequal")    
    element.click()
    # check answer?
    # now subtract 14
    element = driver.find_element(by=By.ID, value="buttonsubtract")    
    element.click()
    element = driver.find_element(by=By.ID, value="button1")    
    element.click()
    element = driver.find_element(by=By.ID, value="button4")    
    element.click()
    element = driver.find_element(by=By.ID, value="buttonequal")    
    element.click()
    




