-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema rrdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema rrdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `rrdb` DEFAULT CHARACTER SET utf8 ;
USE `rrdb` ;

-- -----------------------------------------------------
-- Table `rrdb`.`event_tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`event_tickets` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `event_id` BIGINT(16) ZEROFILL NOT NULL AUTO_INCREMENT,
  `title` TEXT NULL,
  `caller_id` BIGINT(16) ZEROFILL NULL,
  PRIMARY KEY (`event_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`roles` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `role_id` INT(1) ZEROFILL NOT NULL AUTO_INCREMENT,
  `role_label` VARCHAR(45) NULL,
  `details` TEXT NULL,
  PRIMARY KEY (`role_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`priveleges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`priveleges` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `priveleges_id` INT(3) UNSIGNED ZEROFILL NOT NULL,
  `priveleges_label` VARCHAR(45) NULL,
  `details` TEXT NULL,
  PRIMARY KEY (`priveleges_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`users` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `user_id` BIGINT(8) ZEROFILL NOT NULL AUTO_INCREMENT,
  `first_name` TEXT NULL,
  `last_name` TEXT NULL,
  `role_id` INT(1) ZEROFILL NOT NULL,
  `priveleges_id` INT(3) ZEROFILL NOT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_users_priveleges1_idx` (`priveleges_id` ASC) VISIBLE,
  INDEX `fk_users_roles1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_roles1`
    FOREIGN KEY (`role_id`)
    REFERENCES `rrdb`.`roles` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_priveleges1`
    FOREIGN KEY (`priveleges_id`)
    REFERENCES `rrdb`.`priveleges` (`priveleges_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `rrdb`.`priorities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`priorities` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `priority_id` INT(3) ZEROFILL NOT NULL AUTO_INCREMENT,
  `priority_label` VARCHAR(45) NULL,
  `details` TEXT NULL,
  PRIMARY KEY (`priority_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`categories` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `category_id` INT(3) ZEROFILL NOT NULL AUTO_INCREMENT,
  `category_label` VARCHAR(45) NULL,
  `details` TEXT NULL,
  `scale_max` INT(3) NULL,
  PRIMARY KEY (`category_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`status` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `status_id` INT(3) ZEROFILL NOT NULL AUTO_INCREMENT,
  `status_label` VARCHAR(45) NULL,
  `details` TEXT NULL,
  PRIMARY KEY (`status_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`ticket_updates`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`ticket_updates` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `event_id` BIGINT(16) ZEROFILL NOT NULL,
  `update_id` BIGINT(5) ZEROFILL NOT NULL AUTO_INCREMENT,
  `title` TEXT NULL,
  `body` TEXT NULL,
  `status_id` INT(3) ZEROFILL NOT NULL,
  `priority` INT(3) ZEROFILL NOT NULL,
  `category_id` INT(3) ZEROFILL NOT NULL,
  `address` TEXT NULL,
  `location` TEXT NULL,
  `tickets_id` BIGINT(16) ZEROFILL NOT NULL,
  `user_id` BIGINT(8) ZEROFILL NOT NULL,
  `longitude` DECIMAL NULL,
  `lattitude` DECIMAL NULL,
  PRIMARY KEY (`update_id`),
  INDEX `fk_ticket_updates_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_ticket_updates_event_tickets1_idx` (`event_id` ASC) VISIBLE,
  INDEX `fk_ticket_updates_priorities1_idx` (`priority` ASC) VISIBLE,
  INDEX `fk_ticket_updates_status1_idx` (`status_id` ASC) VISIBLE,
  CONSTRAINT `fk_ticket_updates_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rrdb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_updates_event_tickets1`
    FOREIGN KEY (`event_id`)
    REFERENCES `rrdb`.`event_tickets` (`event_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_updates_priorities1`
    FOREIGN KEY (`priority`)
    REFERENCES `rrdb`.`priorities` (`priority_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_updates_categories2`
    FOREIGN KEY (`category_id`)
    REFERENCES `rrdb`.`categories` (`category_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_updates_status1`
    FOREIGN KEY (`status_id`)
    REFERENCES `rrdb`.`status` (`status_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `rrdb`.`keywords`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`keywords` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `keyword_id` INT(5) ZEROFILL NOT NULL AUTO_INCREMENT,
  `keyword_label` VARCHAR(45) NULL,
  `details` TEXT NULL,
  PRIMARY KEY (`keyword_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`mission_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`mission_status` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `status_id` BIGINT(3) ZEROFILL NOT NULL AUTO_INCREMENT,
  `status_label` VARCHAR(45) NULL,
  `details` TEXT NULL,
  PRIMARY KEY (`status_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`missions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`missions` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `mission_id` BIGINT(8) ZEROFILL NOT NULL,
  `comment` VARCHAR(45) NULL,
  `status_id` BIGINT(3) ZEROFILL NOT NULL,
  `om_user` BIGINT(8) ZEROFILL NOT NULL,
  `oc_user` BIGINT(8) ZEROFILL NOT NULL,
  PRIMARY KEY (`mission_id`),
  INDEX `fk_missions_users1_idx` (`om_user` ASC) VISIBLE,
  INDEX `fk_missions_users2_idx` (`oc_user` ASC) VISIBLE,
  INDEX `fk_missions_status1_idx` (`status_id` ASC) VISIBLE,
  CONSTRAINT `fk_missions_users1`
    FOREIGN KEY (`om_user`)
    REFERENCES `rrdb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_missions_users2`
    FOREIGN KEY (`oc_user`)
    REFERENCES `rrdb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_missions_status1`
    FOREIGN KEY (`status_id`)
    REFERENCES `rrdb`.`mission_status` (`status_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `rrdb`.`responders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`responders` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `staff_id` BIGINT(8) ZEROFILL NOT NULL AUTO_INCREMENT,
  `first_name` TEXT NOT NULL,
  `last_name` TEXT NOT NULL,
  `mission_id` BIGINT(8) ZEROFILL NOT NULL,
  PRIMARY KEY (`staff_id`),
  INDEX `fk_responders_missions1_idx` (`mission_id` ASC) VISIBLE,
  CONSTRAINT `fk_responders_missions1`
    FOREIGN KEY (`mission_id`)
    REFERENCES `rrdb`.`missions` (`mission_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `rrdb`.`skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`skills` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `skill_id` BIGINT(5) ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` TEXT NULL,
  PRIMARY KEY (`skill_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`responder_skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`responder_skills` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `staff_id` BIGINT(8) ZEROFILL NOT NULL,
  `skill_id` BIGINT(5) ZEROFILL NOT NULL,
  PRIMARY KEY (`skill_id`, `staff_id`),
  INDEX `fk_staff_skills_staff1_idx` (`staff_id` ASC) VISIBLE,
  CONSTRAINT `fk_staff_skills_staff1`
    FOREIGN KEY (`staff_id`)
    REFERENCES `rrdb`.`responders` (`staff_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_staff_skills_skills1`
    FOREIGN KEY (`skill_id`)
    REFERENCES `rrdb`.`skills` (`skill_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `rrdb`.`keyword_ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`keyword_ticket` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `keyword_id` INT(5) ZEROFILL NOT NULL,
  `update_id` BIGINT(5) ZEROFILL NOT NULL,
  PRIMARY KEY (`keyword_id`, `update_id`),
  INDEX `fk_keyword_ticket_ticket_updates1_idx` (`update_id` ASC) VISIBLE,
  CONSTRAINT `fk_keyword_ticket_keywords1`
    FOREIGN KEY (`keyword_id`)
    REFERENCES `rrdb`.`keywords` (`keyword_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_keyword_ticket_ticket_updates1`
    FOREIGN KEY (`update_id`)
    REFERENCES `rrdb`.`ticket_updates` (`update_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `rrdb`.`mission_event_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`mission_event_list` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `event_id` BIGINT(16) ZEROFILL NOT NULL,
  `mission_id` BIGINT(8) ZEROFILL NOT NULL,
  PRIMARY KEY (`event_id`, `mission_id`),
  INDEX `fk_mission_event_list_missions1_idx` (`mission_id` ASC) VISIBLE,
  CONSTRAINT `fk_mission_event_list_missions1`
    FOREIGN KEY (`mission_id`)
    REFERENCES `rrdb`.`missions` (`mission_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mission_event_list_event_tickets1`
    FOREIGN KEY (`event_id`)
    REFERENCES `rrdb`.`event_tickets` (`event_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `rrdb`.`callers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`callers` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `caller_id` BIGINT(16) ZEROFILL NOT NULL AUTO_INCREMENT,
  `address` TEXT NULL,
  `phone` BIGINT(10) NOT NULL,
  PRIMARY KEY (`caller_id`));


-- -----------------------------------------------------
-- Table `rrdb`.`caller_events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rrdb`.`caller_events` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL,
  `caller_id` BIGINT(16) ZEROFILL NOT NULL,
  `event_id` BIGINT(16) ZEROFILL NOT NULL,
  PRIMARY KEY (`caller_id`, `event_id`),
  INDEX `fk_caller_events_event_tickets1_idx` (`event_id` ASC) VISIBLE,
  CONSTRAINT `fk_caller_events_callers1`
    FOREIGN KEY (`caller_id`)
    REFERENCES `rrdb`.`callers` (`caller_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_caller_events_event_tickets1`
    FOREIGN KEY (`event_id`)
    REFERENCES `rrdb`.`event_tickets` (`event_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
