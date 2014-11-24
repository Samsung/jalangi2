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
    # click the play button
    element = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "a[class=\'play_button\']")))
    element.click()
    # play some moves
    element = driver.find_element(by=By.ID, value="a66")    
    element.click()
    element = driver.find_element(by=By.ID, value="a67")    
    element.click()
    element = driver.find_element(by=By.CSS_SELECTOR, value="a[class=\'left_skip skip_arrow\']")    
    element.click()
    element = driver.find_element(by=By.ID, value="a56")    
    element.click()
    element = driver.find_element(by=By.CSS_SELECTOR, value="a[class=\'left_skip skip_arrow\']")    
    element.click()
    element = driver.find_element(by=By.ID, value="a65")    
    element.click()
    element = driver.find_element(by=By.CSS_SELECTOR, value="a[class=\'left_skip skip_arrow\']")    
    element.click()
    element = driver.find_element(by=By.ID, value="a76")    
    element.click()
    # wait for capture
    WebDriverWait(driver,10).until(lambda driver: driver.execute_script("return document.getElementById(\"a66\").src").endswith("images/Go_Board.png"))
    




