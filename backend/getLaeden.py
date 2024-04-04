from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

options = Options()
options.add_argument("--headless")  # Run Chrome in headless mode
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

def writeToFile(file, data):
    with open(file, "w") as f:
        f.write(data)

def getStadt(url):
    driver.get(url)
    while url == driver.current_url:
        pass
    url = ",".join(driver.current_url.split(",")[:2]) + ",21z"
    driver.get(url)
    while url == driver.current_url:
        pass
    if "place" in driver.current_url:
        return
    bar = None
    while bar is None:
        try:
            bar = driver.find_elements(By.CLASS_NAME, "m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd")[1]
        except:
            pass
    scrolled_at_bottom = False
    while not scrolled_at_bottom:
        driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight)", bar)
        time.sleep(2)
        try:
            driver.find_element(By.CLASS_NAME, "HlvSq")
            scrolled_at_bottom = True
        except:
            pass
    laeden = driver.find_elements(By.CLASS_NAME, "hfpxzc")
    laeden = [laed.get_attribute("href") for laed in laeden]
    with open("backend/shops_url.txt", "a") as f:
        for laed in laeden:
            f.write(laed + "\n")



if __name__ == "__main__":
    with open("backend/plz.txt", "r") as f:
        plzs = f.read().split("\n")
    driver.get("https://www.google.com/maps")
    button_class = "XWZjwc"
    button = driver.find_element(By.CLASS_NAME, button_class)
    button.click()

    time.sleep(3)
    for i, plz in enumerate(plzs):
        # clear the console
        print("\033[H\033[J")
        print("Getting shops for " + plz)
        url = "https://www.google.com/maps/search/" + plz + "%20Doenerladen"
        print("URL: " + url)
        print("Already done: " + str(i))
        print("Remaining: " + str(len(plzs) - i))
        print("Total: " + str(len(plzs)))
        getStadt(url)